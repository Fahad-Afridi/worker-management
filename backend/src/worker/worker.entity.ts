import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
  } from 'typeorm';
  
  const { v4: uuidv4 } = require('uuid');
  
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
  
    @CreateDateColumn()
    joiningDate: Date;
      tasks: any;
  
    @BeforeInsert()
    generateUniqueId() {
      this.uniqueId = uuidv4();
    }
  }