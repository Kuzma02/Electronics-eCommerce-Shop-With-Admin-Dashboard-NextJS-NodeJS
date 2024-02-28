"use server";
import { revalidatePath } from "next/cache";
import prisma from "./db";
import { redirect } from "next/navigation";

export const getAllTasks = async () => {
  return await prisma.product.findMany({});
};

// export const createTask = async (formData: FormData) => {
//   const content = formData.get("content");
//   await prisma.product.create({
//     data: {
//       content,
//     },
//   });
//   revalidatePath("/tasks");
// };

// export const deleteTask = async (formData) => {
//   const id = formData.get("id");

//   await prisma.task.delete({
//     where: { id },
//   });
//   revalidatePath("/tasks");
// };

// export const getSingleTask = async (id) => {
//   return await prisma.task.findFirst({
//     where: {
//       id
//     },
//   });
// };

// export const updateTask = async (formData) => {
//     const id = formData.get("id");
//     const content = formData.get("content");
//     const completed = formData.get("completed");

//     await prisma.task.update({
//         where: {
//             id
//           },
//           data: {
//             content,
//             completed: completed === "on" ? true : false
//           }
//     })
//     redirect("/tasks")
// }
