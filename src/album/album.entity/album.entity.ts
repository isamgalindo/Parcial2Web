import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FotoEntity } from '../../foto/foto.entity/foto.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    fechaInicio: string;
 
    @Column()
    fechaFin: string;
 
    @Column()
    titulo: string;

    @OneToMany(() => FotoEntity, foto => foto.album)
    fotos: FotoEntity[];
}

