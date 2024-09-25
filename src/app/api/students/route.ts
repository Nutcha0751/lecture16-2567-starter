import { NextRequest, NextResponse } from "next/server"; //เป็น modules สำหรับ run บนฝั่ง server
import { DB } from "@lib/DB";
import { zStudentPostBody, zStudentPutBody } from "@lib/schema"; //รับทั้ง 2 ตัวแปรใน schema
// GET http://localhost:3000/api/students //ให้บริการ students, จะส่ง GET ไปที่ url, ตอนส่งค่ามาจะไม่มีค่าของ url ข้างล่างติดมาเลย จะทำให้ข้องล่างเป็น null
// GET http://localhost:3000/api/students?program=CPE //ดูแค่เฉพาะ program ของ CPE
export const GET = async (request:NextRequest) => { //request เป็นชื่อตัวแปร จะรับค่าที่ผู้ใช้ส่งมา, NextRequest เป็น type
    
    const program_name = request.nextUrl.searchParams.get("program"); 
    //const syrdents = DB.students //ดึงข้อมูลจาก data base

    let filtered = DB.students; //ดึงข้อมูลจาก data base
    if(program_name !== null) {
        filtered = filtered.filter( (students) => students.program === program_name ); //ไปเอาเฉพาะ key students ที่มีคำว่า program เท่ากับ program_name
    }
    return NextResponse.json( {
        ok: "ture",
        students: filtered //แสดงข้อมูล program
    } )
};

// POST http://localhost:3000/api/students
//POST เวลาที่จะส่ง request เพื่อไปเพิ่มข้อมูลใหม่ ปล.ต้องมีข้อมูลใหม่แนบไปด้วย เช่น program=CPE ใน url แต่ POST มักจะแนบใน body
//ดังนั้นใน insomnia ต้องไปดูที่ body 
export const POST = async (request:NextRequest) => {
    const body = await request.json(); //request.json() เป็น asychronous function, สั่งให้ทำ แล้วก็ไปทำอย่างอื่น ได้ผลลัพธ์เมื่อไหร่ค่อยกลับมาทำต่อ
    //console.log(body); ปล.จะแสดงบน terminal (ฝั่ง server)

    // validate student data
    const parseResult = zStudentPostBody.safeParse(body); //safeParse(body) เป็นการเรียก function
    if(parseResult.success === false) { //เขียนแค่ว่า !parseResult.success ก็ได้
        return NextResponse.json( {
            ok: false,
            message: parseResult.error.issues[0].message, //แทนที่จะพิมพ์ข้อความเอง ให้เขียนประมาณนี้แทน ซึ่งข้อความอยู่ใน schema แล้ว
        }, {
            status: 400,
        });
    }

    // check studentID duplication
    // foundId = -1 (not found) ไม่เจอ
    // foundId >= 0 (found) เจอ เคย add แล้ว
    //ต่อไปเป็นการเช็คข้อมูลว่าซ้ำไหม
    const foundId = DB.students.findIndex( student => student.studentId === body.studentId); //เช็ค Id ที่จะ add กับ Id ใน body ว่าตรงกันไหม (เจอไหม)

    if(foundId >= 0) { //เจอให้ error
        return NextResponse.json( {
            ok: false,
            message: `Student Id ${body.studentId} already exists`
        }, {
            status: 409,
        });
    }

    // add new student to database
    DB.students.push(body); //push student คนใหม่ใน body
    // send ok response to client
    return NextResponse.json( {
        ok: true,
        message: `Student Id ${body.studentId} has been added`
    } )
};

// PUT http://localhost:3000/api/students // เปลี่ยนข้อมูล
export const PUT = async (request:NextRequest) => {
    const body = await request.json(); //ดึงข้อมูลจาก body
    
    // validate student data
    const parseResult = zStudentPutBody.safeParse(body);
    if(parseResult.success === false) { //ถ้าไม่เจอ
        return NextResponse.json( {
            ok: false,
            message: parseResult.error.issues[0].message,
        }, {
            status: 400,
        });
    }

    // check studentID duplication
    // foundId = -1 (not found) ไม่เจอ
    // foundId >= 0 (found) เจอ เคย add แล้ว
    //ต่อไปเป็นการเช็คข้อมูลว่าซ้ำไหม
    const foundId = DB.students.findIndex( student => student.studentId === body.studentId);

    if(foundId === -1) { //แก้ข้อมูลไม่ได้
        return NextResponse.json( {
            ok: false,
            message: `Student Id ${body.studentId} not exists` 
        }, {
            status: 404,
        });
    }

    return NextResponse.json( { //ข้อมูลซ้ำ (ข้อมูลมีอยู่แล้ว) ต้องแก้ไข
        ok: true,
        message: "PUT method supported"
    } )
};

    //update student data เป็นการเอาข้อมูลที่แก้ไขทับอันเก่าไปเลย (เขียนทับใน ...DB.students[foundId] ปล.ตัวด้านหน้าจะถูกเขียนทับ)
    /*DB.students[foundId] = {...DB.students[foundId], ...body} //คำสั่งในการอัพเดต
    return NextResponse.json( {
        ok: true,
        student: DB.students[foundId]
    } )
};

export const DELETE = async (request:NextRequest) => {
    
}*/

/*http status code
400 : bad request ข้อมูลที่รับมาไม่ถูก format เช่น ME แต่จริงๆต้องใช้แค่ CPE or ISNE
409 : Conflict เกิดความขัดแย้งในข้อความที่ส่งมา*/