import { NextRequest, NextResponse } from "next/server";
import { DB } from "@lib/DB";
import { zStudentPostBody, zStudentPutBody } from "@lib/schema";
// GET http://localhost:3000/api/students
// GET http://localhost:3000/api/students?program=CPE
export const GET = async (request:NextRequest) => {
    
    const program_name = request.nextUrl.searchParams.get("program");

    let filtered = DB.students;
    if(program_name !== null) {
        filtered = filtered.filter( (students) => students.program === program_name ); 
    }
    return NextResponse.json( {
        message: "ok",
        data: filtered
    } )
};

// POST http://localhost:3000/api/students
export const POST = async (request:NextRequest) => {
    const body = await request.json();
    
    // validate student data
    const parseResult = zStudentPostBody.safeParse(body);
    if(parseResult.success === false) {
        return NextResponse.json( {
            ok: false,
            message: parseResult.error.issues[0].message,
        }, {
            status: 400,
        });
    }

    // check studentID duplication
    // foundId = -1 (not found)
    // foundId >= 0 (found)
    const foundId = DB.students.findIndex( student => student.studentId === body.studentId);

    if(foundId >= 0) {
        return NextResponse.json( {
            ok: false,
            message: `Student Id ${body.studentId} already exists`
        }, {
            status: 409,
        });
    }

    // add new student to database
    DB.students.push(body);
    // send ok response to client
    return NextResponse.json( {
        ok: true,
        message: `Student Id ${body.studentId} has been added`
    } )
};

// PUT http://localhost:3000/api/students // เปลี่ยนข้อมูล
export const PUT = async (request:NextRequest) => {
    const body = await request.json();
    
    // validate student data
    const parseResult = zStudentPutBody.safeParse(body);
    if(parseResult.success === false) {
        return NextResponse.json( {
            ok: false,
            message: parseResult.error.issues[0].message,
        }, {
            status: 400,
        });
    }

    // check studentID duplication
    // foundId = -1 (not found)
    // foundId >= 0 (found)
    const foundId = DB.students.findIndex( student => student.studentId === body.studentId);

    if(foundId === -1) {
        return NextResponse.json( {
            ok: false,
            message: `Student Id ${body.studentId} not exists`
        }, {
            status: 404,
        });
    }

    DB.students[foundId] = {...DB.students[foundId], ...body} //คำสั่งในการอัพเดต
    return NextResponse.json( {
        ok: true,
        message: DB.students[foundId]
    } )
};

export const DELETE = async (request:NextRequest) => {
    
}