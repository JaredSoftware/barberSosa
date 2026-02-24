// Datos del catálogo (Sosa Barber) — usar desde server/api o composables en Nuxt
const products = [
  {
    id: 1,
    name: 'Bálsamo de Sándalo',
    category: 'Barba',
    description: 'Receta artesanal de la era victoriana con cera de abeja orgánica y aceites esenciales de sándalo puro.',
    price: 32.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgEBVCXFerp_SFmo6q0Xo79Hlu44wJvN5E26_5I_Srl-m6YeYRxfX09AhMVh0zPOK6dqtxhsOUYTGdXW_6g1lolrlmR13t991pjUGjJYfV9pwXAMd8ZJnJMn4JhLjZ-u0tUuBpD3QkZD_BA6gkdVP4tHRDIjZxDPA1gWvrGa2I8dPOnJgMfRfWDqAPt6a6vZW8654GRtJ4WT5OlF8AyYO8u_h9O9M4reG-UX_j30-GZ2KSftQ3hg48bTFLumaWDLdHcpZe4ot_5UQ',
    badge: 'Premium'
  },
  {
    id: 2,
    name: 'Set de Afeitado Maestro',
    category: 'Afeitado',
    description: 'Set artesanal completo que incluye brocha de pelo de tejón y maquinilla de seguridad de acero quirúrgico.',
    price: 125.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBct6ihkqw6-9D1EhCvVuZaLWHln3h-8Myb3a3-4Sdz7T8MHwcnzX2r0HW09uZXPwOscuM_xVJBiY5eL7s1dE4zehXhR71sKCTTWGEU4zDR3Vgsq5jP3qmiShXrcwLx4-4PZl_5ouzZHDOIb1CkegFp_LAutIYzqNJ3QqBcogavYGzfQM8wHoy5gOmv2Sp7DB1K9DDDJs1OPvtsCe-TbJ4v9wHxZElTbnExAHCXtkMNcGUIxKRzZ5kj6Mfm4qUQfp4otAlfvMu2Dk8'
  },
  {
    id: 3,
    name: 'Pomada de Alta Fijación',
    category: 'Cabello',
    description: 'Fórmula clásica a base de aceite para un acabado pulido atemporal. Resistente al agua.',
    price: 24.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6fjbO6nYgh22hHgtd8IyamlLjTAcaDW9B68CRCo9IxtfBOdGu2SOLncctrm-AUUDakH-hsrpf2mkcZgvTRAI-hUPObGxb2hL8Mjbn3RKvoOkU71QGC_yhA3UEvYtu1pbcYqZtHkkMcyhVe_gxHnXB8JmmFj15-GrwGm5BBHbs5NXW-LME0uumREMsbUIPxPcB3TW2CjjhYiuU-ukXgNiRvnYN7NQO5JkVWnug7ynlR99nkmbU7oM_3Kr5CO0V136QsIVyUkuVS7s'
  },
  {
    id: 4,
    name: 'Aftershave Bay Rum',
    category: 'Afeitado',
    description: 'La esencia masculina por excelencia. Especiado, dulce y notablemente refrescante.',
    price: 18.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0HD4JtXRfFQnnPbrmOZKnNs11m7DXhBLRXqJuf_T61F6zHVsGp3qZCh5YSSnbxOavGjnU8cW70C_99rJuT2gMnWvDKkVayOUyaT6mGkaUBRXoDH9B765JRgw3zED1xnjiWbf_kg5qhuFNoyNCFj42eWzoYrXFREp-WVmnq_2Z4C9bz03zhBE7JwfLJU7NpvtqpJmwig5tfZjDEwWVSRHg88Spluhw7_wT0I2L2Y9xSVwQc1194Dy5QGF5VT9Hg48a0O6PbN0zf3U',
    badge: 'Nuevo'
  },
  {
    id: 5,
    name: 'Peine de Asta Natural',
    category: 'Cabello',
    description: 'Asta de buey pulida a mano. Propiedades antiestáticas para una salud superior del cuero cabelludo.',
    price: 45.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7TFJ9GyO9_oLLmyQFnn--AFWVCh2JNzSs2hwqZQMIOk8bnKkdNWzIaXBYpcZ9vuoUJ6fuTlSNLKcWA8tOqrO8AIZCva_3kysaQ0YMjJhaUj-3bEuizerppMAX0ZEPaHEc3mHVmujT9zKlcf-tcjZYVThzSaSrISO8pwMnmVtYpt_7kLVGl6SdlaqsfpDwVNHgqUSGNTScbt3DAjAJxKg3V8fvc6bPGJgMmQKBUR5KxMgjSxC7aE2uiWzWMOZEt8m52XVDxUaEHqc'
  },
  {
    id: 6,
    name: 'Limpiador de Menta',
    category: 'Barba',
    description: 'Fórmula de limpieza profunda que preserva los aceites naturales para una barba más suave y saludable.',
    price: 19.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdWG0GU1r7ao2WCu-AeoiHMO5V8vo8BA7ftUSzvDzLOa__3ZeEzAdpZY3QIBlM0U_SANI5zL1pGUcbrWCJcGvalbmLx_25OlMFJHTuBJItTdQXIQVl9TGZRxE4Bx8Yr4UX9IhJFAQuNDDcUOS3X-KiE9TlEscjzlH998-MOPto_Q34-qku_k36yn98NxmnOO4ZcbkRBR_ur7ESymhfG-TfxTxYrZXPou4-3jd28p60dLOlbkJgsbU7N06_ExrRuFU-9yuuVTZGEYk'
  }
];

const categories = [
  { id: 'barba', name: 'Barba', icon: 'face', count: 12 },
  { id: 'cabello', name: 'Cabello', icon: 'content_cut', count: 8 },
  { id: 'afeitado', name: 'Afeitado', icon: 'water_drop', count: 15 }
];

module.exports = {
  products,
  categories
};
