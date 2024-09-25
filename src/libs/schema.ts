import { z } from "zod";

const zStudentId = z
  .string() //กำหนดเป็น string
  .length(9, { message: "Student Id must contain 9 characters" }); //ความยาวตัวอักษรเท่ากับ 9 กับแสดงข้อความบอก

  const zFirstName = z
  .string()
  .min(3, { message: "First name requires at least 3 charaters" }); //ความยาวตัวอักษรต้องไม่น้อยกว่า 3

  const zLastName = z
  .string()
  .min(3, { message: "Last name requires at least 3 characters" });

  const zProgram = z.enum(["CPE", "ISNE"], { //enum เช็คว่าป็น string 2 ตัวนี้เท่านั้น ตัวอื่นไม่นับ
  errorMap: () => ({
    message: "Program must be either CPE or ISNE",
  }),
});

export const zStudentPostBody = z.object({ //สำหรับการ POST เพราะจะต้องส่งข้อมูลไป ดังนั้นต้องมีข้อมูลให้ครบ
  studentId: zStudentId,
  firstName: zFirstName,
  lastName: zLastName,
  program: zProgram,
});

export const zStudentPutBody = z.object({ //สำหรับ PUT
  studentId: zStudentId, //fix
  firstName: zFirstName.nullish(), //firstName can be null or undefined
  lastName: zLastName.nullish(), //lastName can be null or undefined
  program: zProgram.nullish(), //program can be null or undefined
});
//.nullish() แปลว่า ไม่ต้องส่งมาก็ได้