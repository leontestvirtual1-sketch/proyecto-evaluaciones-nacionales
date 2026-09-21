/**
 * scripts/create_director_and_utp_accounts.mjs
 * 
 * Crea las cuentas de Director y Jefe UTP en Supabase Auth y public.perfiles:
 * - Director: director@premil.cl / Director2026!
 * - Jefe UTP: utp.ciencias@premil.cl / Utp2026!
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const sbAdmin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const ACCOUNTS = [
  {
    email: 'director@premil.cl',
    password: 'Director2026!',
    user_metadata: { nombre: 'Eduardo', apellido: 'Valenzuela Bravo' },
    profile: {
      rut: '12.890.123-4',
      nombre: 'Eduardo',
      apellido: 'Valenzuela Bravo',
      email: 'director@premil.cl',
      rol: 'profesor',
      cargo: 'Director General',
      establecimiento: 'Escuela Premilitar Héroes de la Concepción',
      rbd: '31030',
      comuna: 'La Granja',
      dependencia: 'Particular Subvencionado',
      estado: 'activo',
      plan: 'institucional',
      activo: true,
      dias_restantes_trial: 30
    }
  },
  {
    email: 'utp.ciencias@premil.cl',
    password: 'Utp2026!',
    user_metadata: { nombre: 'Claudia', apellido: 'Soto Navarrete' },
    profile: {
      rut: '15.678.901-2',
      nombre: 'Claudia',
      apellido: 'Soto Navarrete',
      email: 'utp.ciencias@premil.cl',
      rol: 'profesor',
      cargo: 'Jefe de UTP',
      establecimiento: 'Escuela Premilitar Héroes de la Concepción',
      rbd: '31030',
      comuna: 'La Granja',
      dependencia: 'Particular Subvencionado',
      estado: 'activo',
      plan: 'institucional',
      activo: true,
      dias_restantes_trial: 30
    }
  }
];

async function setupAccounts() {
  console.log('🚀 Creando/verificando cuentas Director y Jefe UTP en Supabase...\n');

  const { data: existingUsersData, error: listErr } = await sbAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('❌ Error listando usuarios:', listErr.message);
    process.exit(1);
  }

  for (const acc of ACCOUNTS) {
    console.log(`\n📌 Procesando: ${acc.email} (${acc.profile.cargo})`);
    let authUser = existingUsersData.users.find(u => u.email?.toLowerCase() === acc.email.toLowerCase());

    if (authUser) {
      console.log(`   ℹ️ Usuario Auth ya existe: ${authUser.id}. Actualizando contraseña...`);
      const { error: updErr } = await sbAdmin.auth.admin.updateUserById(authUser.id, {
        password: acc.password,
        email_confirm: true,
        user_metadata: acc.user_metadata
      });
      if (updErr) console.warn(`   ⚠️ Advertencia actualizando password: ${updErr.message}`);
      else console.log(`   ✅ Contraseña establecida.`);
    } else {
      console.log(`   Creando usuario en Auth...`);
      const { data: created, error: createErr } = await sbAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: acc.user_metadata
      });
      if (createErr) {
        console.error(`   ❌ Error creando auth user: ${createErr.message}`);
        continue;
      }
      authUser = created.user;
      console.log(`   ✅ Usuario Auth creado: ${authUser.id}`);
    }

    // Verificar / Insertar perfil
    const { data: existingProfile } = await sbAdmin
      .from('perfiles')
      .select('id, rol, cargo, rbd, estado')
      .eq('id', authUser.id)
      .maybeSingle();

    if (existingProfile) {
      console.log(`   ℹ️ Perfil ya existe. Actualizando datos de cargo y establecimiento...`);
      const { error: updProfileErr } = await sbAdmin
        .from('perfiles')
        .update({
          cargo: acc.profile.cargo,
          establecimiento: acc.profile.establecimiento,
          rbd: acc.profile.rbd,
          estado: 'activo',
          plan: 'institucional',
          activo: true
        })
        .eq('id', authUser.id);

      if (updProfileErr) console.error(`   ❌ Error actualizando perfil: ${updProfileErr.message}`);
      else console.log(`   ✅ Perfil actualizado exitosamente.`);
    } else {
      console.log(`   Insertando nuevo perfil en public.perfiles...`);
      const { error: insErr } = await sbAdmin
        .from('perfiles')
        .insert({
          id: authUser.id,
          ...acc.profile
        });

      if (insErr) console.error(`   ❌ Error insertando perfil: ${insErr.message}`);
      else console.log(`   ✅ Perfil insertado exitosamente con ID ${authUser.id}.`);
    }
  }

  console.log('\n✨ Verificación final de perfiles creados:');
  const { data: finalPerfiles } = await sbAdmin
    .from('perfiles')
    .select('id, email, rol, cargo, establecimiento, rbd, estado, plan')
    .in('email', ['director@premil.cl', 'utp.ciencias@premil.cl']);

  console.table(finalPerfiles);
}

setupAccounts().catch(console.error);
