import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getStudentByClerkId(clerkId: string) {
  // const getStudentByClerkIdQuery = groq`*[_type == 'student' && clerkId == $clerkId][0]`  //works too
  console.log("clerkId in getStudent", clerkId);
  const getStudentByClerkIdQuery = defineQuery(`*[_type == 'student' && clerkId == $clerkId][0]`);

  const student = await sanityFetch({
    query: getStudentByClerkIdQuery,
    params: { clerkId },
  });

  console.log("s", student, student.data);

  return student.data;
}
