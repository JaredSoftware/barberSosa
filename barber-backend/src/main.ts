import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users/schemas/user.schema';
import { Category } from './categories/schemas/category.schema';
import { Offer } from './offers/schemas/offer.schema';
import * as bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 4000;

  // Habilitar cookie-parser para manejar sessionId
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URLS?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // Habilitar validación global para DTOs
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar para servir archivos estáticos del frontend ecommerce (ruta raíz)
  const possibleEcommercePaths = [
    join(__dirname, '../../public'), // Carpeta public en source (para volumenes docker) - PRIORIDAD ALTA
    join(__dirname, '../public'), // Carpeta public dentro del backend (build copiado aquí)
    join(__dirname, '../../barberEcommerce/.output/public'),
    join(__dirname, '../../barberEcommerce/.output/server/public'),
    join(__dirname, '../../barberEcommerce/dist'),
    join(__dirname, '../../barberEcommerce/.nuxt/dist/client'),
  ];

  let ecommerceStaticPath: string | null = null;
  for (const path of possibleEcommercePaths) {
    if (existsSync(path)) {
      ecommerceStaticPath = path;
      break;
    }
  }

  // Servir frontend ecommerce (incluye admin en /admin)
  // El build de barberEcommerce incluye todas las rutas, incluyendo /admin
  if (ecommerceStaticPath) {
    app.useStaticAssets(ecommerceStaticPath, {
      prefix: '/',
      index: false,
    });
    console.log(
      `📦 Frontend (ecommerce + admin) desde: ${ecommerceStaticPath}`,
    );
  } else {
    console.warn('⚠️  No se encontró el build del frontend.');
  }

  // Middleware para manejar SPA routing - debe ejecutarse después de useStaticAssets
  app.use((req, res, next) => {
    // Dejar pasar rutas API
    if (req.path.startsWith('/api')) {
      return next();
    }
    // Servir index.html para rutas del frontend (SPA)
    if (ecommerceStaticPath) {
      const indexPath = join(ecommerceStaticPath, 'index.html');
      if (existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        next();
      }
    } else {
      next();
    }
  });

  // Inicializar datos por defecto (admin, categorías)
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const categoryModel = app.get<Model<Category>>(getModelToken(Category.name));
  const offerModel = app.get<Model<Offer>>(getModelToken(Offer.name));

  // Crear usuario admin por defecto si no existe
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sosabarber.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';

  const existingAdmin = await userModel.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userModel.create({
      name: 'Admin User',
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
    });
    console.log(`✅ Usuario admin creado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('ℹ️  Usuario admin ya existe');
  }

  // Crear categorías por defecto si no existen
  const categoriesCount = await categoryModel.countDocuments();
  if (categoriesCount === 0) {
    const defaultCategories = [
      { name: 'Barba', icon: 'face', order: 1, active: true },
      { name: 'Cabello', icon: 'content_cut', order: 2, active: true },
      { name: 'Afeitado', icon: 'water_drop', order: 3, active: true },
    ];
    await categoryModel.insertMany(defaultCategories);
    console.log('✅ Categorías por defecto creadas');
  } else {
    console.log('ℹ️  Las categorías ya existen');
  }

  // Crear ofertas/servicios por defecto si no existen (cortes para reservas)
  const offersCount = await offerModel.countDocuments();
  if (offersCount === 0) {
    const defaultOffers = [
      {
        title: 'Corte Clásico',
        description:
          'Corte tradicional con tijera o máquina adaptado a tu rostro. Incluye lavado y peinado.',
        price: 30,
        duration: 45,
        active: true,
      },
      {
        title: 'Afeitado a Navaja',
        description:
          'Afeitado tradicional con navaja, espuma caliente, aceites previos y bálsamo refrescante.',
        price: 25,
        duration: 30,
        active: true,
      },
      {
        title: 'Tratamiento de Toalla Caliente',
        description:
          'Tratamiento facial rejuvenecedor con toallas al vapor, aceites esenciales y masaje premium.',
        price: 15,
        duration: 20,
        active: true,
      },
      {
        title: 'Recorte de Barba',
        description:
          'Perfilado profesional, recorte y definición de líneas para un look limpio y nítido.',
        price: 20,
        duration: 25,
        active: true,
      },
    ];
    await offerModel.insertMany(defaultOffers);
    console.log('✅ Ofertas/servicios por defecto creados');
  } else {
    console.log('ℹ️  Las ofertas ya existen');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend escuchando en http://0.0.0.0:${port}`);
}

bootstrap();
