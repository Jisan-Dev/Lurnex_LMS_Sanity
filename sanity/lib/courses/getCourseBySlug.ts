import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getCourseBySlug(slug: string) {
  const getCourseBySlugQuery = defineQuery(`*[_type == 'course' && slug.current == $slug][0]{
    ...,
    "category": category->{...},
    "instructor": instructor->{...},
    "modules": modules[]->{
      ...,
      "lessons": lessons[]->{...}
    }
  }`);

  const result = await sanityFetch({
    query: getCourseBySlugQuery,
    params: { slug },
  });

  return result.data;
}
