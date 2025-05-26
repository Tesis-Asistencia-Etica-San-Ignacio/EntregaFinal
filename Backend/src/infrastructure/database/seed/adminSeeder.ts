import bcrypt from 'bcryptjs'
import { User } from '../../../infrastructure/database/models/user.model'

export async function seedAdminUser() {
  const email = 'admin-husi@gmail.com'
  // 1) ¿Ya existe?
  const exists = await User.exists({ email })
  if (exists) {
    console.log('👤 Admin ya existe')
    return
  }

  // 2) Si no, creamos con todos los campos que tu esquema necesita
  const passwordHash = await bcrypt.hash('Password123*', 10)
  await User.create({
    name: 'Admin',
    last_name: 'Husi',
    email,
    password: passwordHash,
    type: 'EVALUADOR',
    modelo: '',      // valor por defecto que tú decidas
    provider: '',     // idem
    // createdAt/updatedAt vienen solos si tu schema tiene timestamps:true
  })

  console.log('✅ Admin creado correctamente')
}

//Contiene versión y fecha del FCI. Ignora la fecha ubicada en el encabezado y solo ten en cuenta las fechas del pie de pagina