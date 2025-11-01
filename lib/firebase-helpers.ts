import { collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"

// Teacher Authentication
export const registerTeacher = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await setDoc(doc(db, "teachers", user.uid), {
    uid: user.uid,
    email,
    name,
    createdAt: new Date().toISOString(),
  })

  return user
}

export const loginTeacher = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const logoutTeacher = async () => {
  await signOut(auth)
}

export const getAllTeachers = async () => {
  const teachersRef = collection(db, "teachers")
  const snapshot = await getDocs(teachersRef)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[]
}

export const deleteTeacherAccount = async (teacherId: string) => {
  const teacherRef = doc(db, "teachers", teacherId)
  await deleteDoc(teacherRef)
}

// Exam Management
export const createExam = async (
  teacherId: string,
  examName: string,
  duration: number,
  examCode: string,
  questions: any[],
) => {
  const examsRef = collection(db, "teachers", teacherId, "exams")
  const docRef = await addDoc(examsRef, {
    name: examName,
    duration,
    examCode,
    questions,
    createdAt: new Date().toISOString(),
    isActive: true,
  })
  return docRef.id
}

export const getTeacherExams = async (teacherId: string) => {
  const examsRef = collection(db, "teachers", teacherId, "exams")
  const snapshot = await getDocs(examsRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getExamByCode = async (examCode: string) => {
  const examsRef = collection(db, "teachers")
  const allTeachers = await getDocs(examsRef)

  for (const teacherDoc of allTeachers.docs) {
    const examsSnapshot = await getDocs(collection(db, "teachers", teacherDoc.id, "exams"))
    const exam = examsSnapshot.docs.find((doc) => doc.data().examCode === examCode)
    if (exam) {
      return { id: exam.id, teacherId: teacherDoc.id, ...exam.data() }
    }
  }
  return null
}

export const updateExam = async (teacherId: string, examId: string, updates: any) => {
  const examRef = doc(db, "teachers", teacherId, "exams", examId)
  await updateDoc(examRef, updates)
}

export const deleteExam = async (teacherId: string, examId: string) => {
  const examRef = doc(db, "teachers", teacherId, "exams", examId)
  await deleteDoc(examRef)
}

// Update Question in Exam
export const updateExamQuestion = async (
  teacherId: string,
  examId: string,
  questionIndex: number,
  updatedQuestion: any,
) => {
  const examRef = doc(db, "teachers", teacherId, "exams", examId)
  const examDoc = await getDoc(examRef)
  const questions = examDoc.data()?.questions || []
  questions[questionIndex] = updatedQuestion
  await updateDoc(examRef, { questions })
}

export const deleteExamQuestion = async (teacherId: string, examId: string, questionIndex: number) => {
  const examRef = doc(db, "teachers", teacherId, "exams", examId)
  const examDoc = await getDoc(examRef)
  const questions = examDoc.data()?.questions || []
  questions.splice(questionIndex, 1)
  await updateDoc(examRef, { questions })
}

// Student Results
export const submitExamResult = async (
  teacherId: string,
  examId: string,
  studentName: string,
  studentRollNo: string,
  score: number,
  totalQuestions: number,
  answers: any[],
) => {
  const resultsRef = collection(db, "teachers", teacherId, "exams", examId, "results")
  const docRef = await addDoc(resultsRef, {
    studentName,
    studentRollNo,
    score,
    totalQuestions,
    percentage: (score / totalQuestions) * 100,
    answers,
    submittedAt: new Date().toISOString(),
  })
  return docRef.id
}

export const getExamResults = async (teacherId: string, examId: string) => {
  const resultsRef = collection(db, "teachers", teacherId, "exams", examId, "results")
  const snapshot = await getDocs(resultsRef)
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score)
}

export const deleteStudentResult = async (teacherId: string, examId: string, resultId: string) => {
  const resultRef = doc(db, "teachers", teacherId, "exams", examId, "results", resultId)
  await deleteDoc(resultRef)
}

// Student Management
export const registerStudent = async (email: string, password: string, name: string, rollNo: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await setDoc(doc(db, "students", user.uid), {
    uid: user.uid,
    email,
    name,
    rollNo,
    createdAt: new Date().toISOString(),
  })

  return user
}

export const loginStudent = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const addStudentExamHistory = async (
  studentId: string,
  examId: string,
  examName: string,
  score: number,
  totalQuestions: number,
  percentage: number,
) => {
  const historyRef = collection(db, "students", studentId, "examHistory")
  await addDoc(historyRef, {
    examId,
    examName,
    score,
    totalQuestions,
    percentage,
    submittedAt: new Date().toISOString(),
  })
}

export const getStudentExamHistory = async (studentId: string) => {
  const historyRef = collection(db, "students", studentId, "examHistory")
  const snapshot = await getDocs(historyRef)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const checkFirebaseAuthConfigured = () => {
  return auth !== null && auth !== undefined
}
