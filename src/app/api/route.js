import { NextResponse } from "next/server";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import mysql from "mysql2/promise";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Database connection pool
const dbPool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Akash2006#Ak",
  database: "clg",
});

// *Define Functions for Each Column-Based Search*

async function fetchByRegisterNo(registerNo) {
  const query = `SELECT * FROM sample WHERE Register_No LIKE ?`;
  const normalizedReg = `%${registerNo}%`;
  console.log("Executing query:", query, "with registerNo:", normalizedReg);
  const [rows] = await dbPool.execute(query, [normalizedReg]);
  return rows;
}

async function fetchByStudentName(studentName) {
  const query = `
    SELECT * FROM sample 
    WHERE REPLACE(LOWER(Students_Name), ' ', '') LIKE REPLACE(LOWER(?), ' ', '')
  `;
  const normalizedName = `%${studentName.replace(/\s+/g, '')}%`;
  console.log("Executing query:", query, "with studentName:", normalizedName);
  const [rows] = await dbPool.execute(query, [normalizedName]);
  return rows;
}

async function fetchByMailId(mailId) {
  const query = `SELECT * FROM sample WHERE Mail_id LIKE ?`;
  const normalizedMail = `%${mailId}%`;
  console.log("Executing query:", query, "with mailId:", normalizedMail);
  const [rows] = await dbPool.execute(query, [normalizedMail]);
  return rows;
}
async function fetchByDepartment(department = null) {
  let query = `
    SELECT 
        Register_No, 
        Students_Name, 
        Mail_id, 
        Department, 
        Grouping_Points_calculation_March_18_03_2025
    FROM sample
  `;

  // If a department is provided, filter by department
  if (department) {
    query += ` WHERE Department LIKE ?`;
  }

  query += ` ORDER BY Department ASC, Grouping_Points_calculation_March_18_03_2025 DESC;`;

  const params = department ? [`%${department}%`] : [];
  console.log("Executing query:", query, "with params:", params);
  
  const [rows] = await dbPool.execute(query, params);
  return rows;
}



async function fetchByScore(minScore) {
  const query = `SELECT * FROM sample WHERE Grouping_Points_calculation_March_18_03_2025 >= ?`;
  console.log("Executing query:", query, "with minScore:", minScore);
  const [rows] = await dbPool.execute(query, [minScore]);
  return rows;
}

// Function to fetch the count of students in each group
async function fetchGroupCounts() {
  const query = `
    SELECT Group_calculated_March_18_03_2025 AS group_name, COUNT(*) AS count
    FROM sample
    GROUP BY Group_calculated_March_18_03_2025
    ORDER BY Group_calculated_March_18_03_2025 ASC
  `;
  console.log("Executing query:", query);
  const [rows] = await dbPool.execute(query);
  return rows;
}

// Function to fetch all students belonging to a specific group
async function fetchByGroup() {
  const query = `
    SELECT 
        Register_No, 
        Students_Name, 
        Mail_id, 
        Department, 
        Group_calculated_March_18_03_2025 AS group_name,
        Grouping_Points_calculation_March_18_03_2025
    FROM sample
    ORDER BY Group_calculated_March_18_03_2025 ASC, 
             Grouping_Points_calculation_March_18_03_2025 DESC;
  `;

  console.log("Executing query:", query);
  const [rows] = await dbPool.execute(query);
  return rows;
}


// *Define AI Tool Calls for Function Calling*
const tools = {
  fetchByRegisterNo: tool({
    description: "Fetch student data by Register Number",
    parameters: z.object({ registerNo: z.string() }),
    execute: async ({ registerNo }) => fetchByRegisterNo(registerNo),
  }),

  fetchByStudentName: tool({
    description: "Fetch student data by Student Name",
    parameters: z.object({ studentName: z.string() }),
    execute: async ({ studentName }) => fetchByStudentName(studentName),
  }),

  fetchByMailId: tool({
    description: "Fetch student data by Email ID",
    parameters: z.object({ mailId: z.string() }),
    execute: async ({ mailId }) => fetchByMailId(mailId),
  }),

  fetchByDepartment: tool({
    description: "Fetch student data by Department",
    parameters: z.object({ department: z.string() }),
    execute: async ({ department }) => fetchByDepartment(department),
  }),

  fetchByScore: tool({
    description: "Fetch student data by minimum score",
    parameters: z.object({ minScore: z.number() }),
    execute: async ({ minScore }) => fetchByScore(minScore),
  }),

  fetchByGroup: tool({
    description: "Fetch student data by Group",
    parameters: z.object({ group: z.string() }),
    execute: async ({ group }) => fetchByGroup(group),
  }),

  fetchGroupCounts: tool({
    description: "Fetch the count of students in each group",
    parameters: z.object({}),
    execute: async () => fetchGroupCounts(),
  }),
};

// *Handle POST Request*
export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    const prompt = `
      You are an AI assistant designed to understand user search queries for student data. Identify the relevant column the user is searching by and call the appropriate function.

      Use the following tool calls:

      - fetchByRegisterNo(registerNo): Search students by registration number.
      - fetchByStudentName(studentName): Search students by name.
      - fetchByMailId(mailId): Search students by email.
      - fetchByDepartment(department): Search students by department.
      - fetchByScore(minScore): Search students with a score above a given value.
      - fetchByGroup(group): Search students by group.
      - fetchGroupCounts(): Get a count of students in each group.

      Examples:

      User: Find student with register number 7376232AL101
      Tool Call: fetchByRegisterNo(registerNo="7376232AL101")

      User: Show all students in Computer Science
      Tool Call: fetchByDepartment(department="Computer Science")

      User: Get students with score above 300
      Tool Call: fetchByScore(minScore=300)

      User: Show all students in Group 2
      Tool Call: fetchByGroup(group="Group 2")

      User: Who is Akash?
      Tool Call: fetchByStudentName(studentName="Akash")

      User: Find the student with email akash@example.com
      Tool Call: fetchByMailId(mailId="akash@example.com")

      User: How many students are in each group?
      Tool Call: fetchGroupCounts()

      User:list all students by groups
      Tool Call:fetchByGroup()
    
      User: ${message}
      Tool Call:
    `;

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      tools: tools,
      prompt: prompt,
    });

    console.log("AI Response:", result);

    return NextResponse.json({
      success: true,
      toolUsed: result.toolResults?.[0]?.toolName || null,
      data: result.toolResults?.[0]?.result || [],
      message:
        result.toolResults?.[0]?.result?.length > 0
          ? `Found ${result.toolResults[0].result.length} record(s).`
          : "No records found.",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: [] },
      { status: 500 }
    );
  }
}
