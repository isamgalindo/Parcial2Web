import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class FotoEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ISO: number;
    
    @Column()
    velObturacion: number;
    
    @Column()
    apertura: number;
    
    @Column()
    fecha: string;

    @Column()
    image: string;

    @ManyToOne(() => UsuarioEntity, usuario =>  usuario.fotos)
    usuario: UsuarioEntity;

}
