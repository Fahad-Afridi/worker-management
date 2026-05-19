import { Task } from 'src/task/task.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
  } from 'typeorm';
  
  const { v4: uuidv4 } = require('uuid');

  export enum Role{
    WORKER = 'worker',
    ADMIN = 'admin',
  }
  
  @Entity('workers')
  export class Worker {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    uniqueId: string;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ select: false })
    password: string;
  
    @Column()
    country: string;

    @Column({
      type: 'enum',
      enum: Role,
      default: Role.WORKER,
    })
    role: Role;

    @Column({type:'text', nullable: true, select: false})
    resetToken: string | null;

    @Column({type:'timestamp' , nullable: true})
    resetTokenExpiry: Date | null;
  
    @CreateDateColumn()
    joiningDate: Date;

    @OneToMany(()=>Task, (task)=>task.worker)
    task: Task[];
  
    @BeforeInsert()
    generateUniqueId() {
      this.uniqueId = uuidv4();
    }
  }