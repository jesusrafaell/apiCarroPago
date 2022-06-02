import {MigrationInterface, QueryRunner} from "typeorm";

export class APICP11654180944665 implements MigrationInterface {
    name = 'APICP11654180944665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "origin_logs_carropago" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_7d9812540f80b7072a3264ef85d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "general_logs_carropago" ("id" int NOT NULL IDENTITY(1,1), "descript" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_2613c45930cfd6b3f1f8a0debbc" DEFAULT getdate(), "id_user" int, "id_origin_logs_carropago" int, CONSTRAINT "PK_9c40a94f1e1dfc174d6c0387dd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "general_logs_carropago" ADD CONSTRAINT "FK_24ce34e6f9983bedc43e3e4d97b" FOREIGN KEY ("id_user") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "general_logs_carropago" ADD CONSTRAINT "FK_dc04b05bb45afe1e6e95c64356a" FOREIGN KEY ("id_origin_logs_carropago") REFERENCES "origin_logs_carropago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_logs_carropago" DROP CONSTRAINT "FK_dc04b05bb45afe1e6e95c64356a"`);
        await queryRunner.query(`ALTER TABLE "general_logs_carropago" DROP CONSTRAINT "FK_24ce34e6f9983bedc43e3e4d97b"`);
        await queryRunner.query(`DROP TABLE "general_logs_carropago"`);
        await queryRunner.query(`DROP TABLE "origin_logs_carropago"`);
    }

}
