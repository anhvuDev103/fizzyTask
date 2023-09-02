import { ObjectId } from 'mongodb';

import { TaskStatus } from '~/constants/enums';

interface TaskType {
  _id?: ObjectId;
  title: string;
  description?: string | null;
  due_date?: Date | null;
  status?: TaskStatus;
  created_at?: Date;
  updated_at?: Date;
  user_id: ObjectId;
  tag_ids?: ObjectId[];
  project_id?: ObjectId | null;
}

class Task {
  _id: ObjectId;
  title: string;
  description: string | null;
  due_date: Date | null;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
  user_id: ObjectId;
  tag_ids: ObjectId[];
  project_id: ObjectId | null;

  constructor(payload: TaskType) {
    const now = new Date();

    this._id = payload._id || new ObjectId();
    this.title = payload.title;
    this.description = payload.description || null;
    this.due_date = payload.due_date || null;
    this.status = payload.status || TaskStatus.Incomplete;
    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
    this.user_id = payload.user_id;
    this.tag_ids = payload.tag_ids || [];
    this.project_id = payload.project_id || null;
  }
}

export default Task;
