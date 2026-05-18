import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Worker } from '../worker/worker.entity';

export enum TaskStatus{
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

@Entity('task')
export class Task{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;

    @ManyToOne(()=> Worker,(worker)=>worker.tasks,{
        onDelete: 'CASCADE',
    })

    @JoinColumn({name: 'workerId'})
    worker : Worker;

    @Column()
    workerId: number;
}