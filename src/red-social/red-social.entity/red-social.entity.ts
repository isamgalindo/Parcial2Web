import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class RedSocialEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    slogan: string;
    
    @OneToMany(() => UsuarioEntity, (usuario) => usuario.redSocial)
    usuarios: UsuarioEntity[];
}
