import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683122001000 implements MigrationInterface {
    name = 'InitialMigration1683122001000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tạo enum types
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')`);

        // Tạo bảng Category
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text,
                "imageUrl" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "parentId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_category_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_category" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng Product
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "originalPrice" numeric(10,2),
                "stock" integer NOT NULL DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "imageUrls" text,
                "thumbnailUrl" character varying,
                "categoryId" character varying NOT NULL,
                "attributes" jsonb,
                "tags" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_product_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_product" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng User
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "name" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                "avatarUrl" character varying,
                "phoneNumber" character varying,
                "address" character varying,
                "isMfaEnabled" boolean NOT NULL DEFAULT false,
                "mfaSecret" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "resetPasswordToken" character varying,
                "resetPasswordExpires" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng Order
        await queryRunner.query(`
            CREATE TABLE "order" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "subtotal" numeric(10,2) NOT NULL,
                "shippingCost" numeric(10,2) NOT NULL DEFAULT 0,
                "discount" numeric(10,2) NOT NULL DEFAULT 0,
                "total" numeric(10,2) NOT NULL,
                "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending',
                "shippingAddress" jsonb,
                "paymentInfo" jsonb,
                "notes" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "completedAt" TIMESTAMP,
                CONSTRAINT "PK_order" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng OrderItem
        await queryRunner.query(`
            CREATE TABLE "order_item" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "productId" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "selectedOptions" jsonb,
                "orderId" character varying NOT NULL,
                CONSTRAINT "PK_order_item" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng Cart
        await queryRunner.query(`
            CREATE TABLE "cart" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "productId" character varying NOT NULL,
                "quantity" integer NOT NULL DEFAULT 1,
                "selectedOptions" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cart" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo bảng Favorite
        await queryRunner.query(`
            CREATE TABLE "favorite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "productId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_favorite" PRIMARY KEY ("id")
            )
        `);
        
        // Tạo indexes
        await queryRunner.query(`CREATE INDEX "IDX_category_name" ON "category" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_category_slug" ON "category" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_product_name" ON "product" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_product_slug" ON "product" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_email" ON "user" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_order_userId" ON "order" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_cart_userId" ON "cart" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_favorite_userId" ON "favorite" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_favorite_productId" ON "favorite" ("productId")`);
        
        // Tạo quan hệ Foreign Keys
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_product_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_order_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_order_item_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_order_item_order" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_cart_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_cart_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xóa quan hệ Foreign Keys
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_product"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_user"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_product"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_user"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_order"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_product"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_order_user"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_product_category"`);
        
        // Xóa indexes
        await queryRunner.query(`DROP INDEX "IDX_favorite_productId"`);
        await queryRunner.query(`DROP INDEX "IDX_favorite_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_cart_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_order_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_user_email"`);
        await queryRunner.query(`DROP INDEX "IDX_product_slug"`);
        await queryRunner.query(`DROP INDEX "IDX_product_name"`);
        await queryRunner.query(`DROP INDEX "IDX_category_slug"`);
        await queryRunner.query(`DROP INDEX "IDX_category_name"`);
        
        // Xóa bảng
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        
        // Xóa enum types
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }
} 