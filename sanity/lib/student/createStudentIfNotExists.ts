import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { client } from "../adminClient";

interface createStudentProps {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export async function createStudentIfNotExists({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: createStudentProps) {
  const existingStudentQuery = await sanityFetch({
    query: defineQuery(`*[_type == 'student' && clerkId == $clerkId][0]`),
    params: { clerkId },
  });

  if (existingStudentQuery.data) {
    console.log("Student already exists:", existingStudentQuery.data);
    return existingStudentQuery.data;
  }

  // if no student exists, create a new one
  const newStudent = await client.create({
    _type: "student",
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  console.log("New student created:", newStudent);

  return newStudent;
}
