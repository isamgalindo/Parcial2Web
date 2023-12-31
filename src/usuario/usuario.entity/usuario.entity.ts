import { RedSocialEntity } from '../../red-social/red-social.entity/red-social.entity';
import { FotoEntity } from '../../foto/foto.entity/foto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class UsuarioEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    telefono: string;

    @OneToMany(() => FotoEntity, foto => foto.usuario)
    fotos: FotoEntity[];

    @ManyToOne(() => RedSocialEntity, redSocial =>  redSocial.usuarios)
    redSocial: RedSocialEntity;

}
