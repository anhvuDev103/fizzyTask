```ts
enum TaskStatus {
  Incomplete
  Complete
}

interface User {
  _id: ObjectId
  email: string
  fullname: string
  password: string
  username: string | null
  email_verify_token: string | null
  forgot_password_token: string | null
  created_at: Date
  updated_at: Date
}

interface RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
}

interface Task {
  _id: ObjectId
  title: string
  description: string | null
  due_date: Date | null
  status: TaskStatus
  created_at: Date
  updated_at: Date
  user_id: ObjectId
  tag_ids: ObjectId[]
  project_id: ObjectId | null
}

interface Tag {
  _id: ObjectId
  title: string
  color: string | null
  created_at: Date
  updated_at: Date
}

interface Project {
  _id: ObjectId
  title: string
  color: string | null
  created_at: Date
  updated_at: Date
}
```
