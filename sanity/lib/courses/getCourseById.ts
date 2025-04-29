import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getCourseById(id: string) {
  const getCourseByIdQuery = defineQuery(`*[_type == 'course' && _id == $id][0]{
    ..., // Spread all course fields
    "instructor": instructor->{...}, // Expand the instructor reference, including all its fields
    "category": category->{...}, // Expand the category reference, including all its fields
    "modules": modules[]->{ // Expand the array of module references
      ..., // Include all module fields
      "lessons": lessons[]->{...} // For each module, expand its array of lesson references
    }
  }`);

  const result = await sanityFetch({
    query: getCourseByIdQuery,
    params: { id },
  });

  // Return just the data portion of the response
  return result.data;
}
