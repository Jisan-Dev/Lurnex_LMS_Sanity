"use server";

import baseUrl from "@/lib/baseUrl";
import stripe from "@/lib/stripe";
import { createEnrollment } from "@/sanity/lib/courses/createEnrollment";
import { getCourseById } from "@/sanity/lib/courses/getCourseById";
import { urlFor } from "@/sanity/lib/image";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";

export async function createStripeCheckout(courseId: string, userId: string) {
  try {
    //1. query course details from sanity
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!email || !emailAddresses) {
      throw new Error("User details not found!");
    }

    if (!course) {
      throw new Error("Course not found!");
    }

    //* mid step - create a user(student) in sanity if it doesn't exist (our business logic is we will not sync the user in our db until the user enrolls in a course.)
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      throw new Error("User not found");
    }

    //2. validate course data and prepare price for stripe
    if (!course.price && course.price !== 0) {
      throw new Error("Course price is not set!");
    }
    const priceInCents = Math.round(course.price * 100);

    //if course is free, create enrollment & redirect to course page (BYPASS STRIPE CHECKOUT)
    if (priceInCents === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });
      return { url: `/courses/${course.slug?.current}` };
    }

    const { title, description, image, slug } = course;
    if (!title || !description || !image || !slug) throw new Error("Course Data is Incomplete");

    //3. Create and configure stripe checkout session with course details
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/courses/${slug.current}`,
      cancel_url: `${baseUrl}/courses/${slug.current}?canceled=true`,
      metadata: {
        courseId: course._id,
        userId: userId, // it has to be userId not user._id(from sanity) because down the line(in webhook) we used this id to get the student by clerk id( const student = await getStudentByClerkId(userId);)
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: description,
              images: [urlFor(image).url() || ""],
            },
            unit_amount: priceInCents,
          },
        },
      ],
    });

    //4. Return checkout session URL for client redirect
    return { url: session.url };
  } catch (error) {
    console.error("Error in createStripeCheckout: ", error);
    throw new Error("Failed to create checkout session");
  }
}
