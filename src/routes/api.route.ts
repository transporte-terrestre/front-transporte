const BASE_URL_LOCAL = 'http://localhost:3000';
const BASE_URL_GLOBAL = 'http://34.31.2.133:3000';

const BASE_URL = BASE_URL_LOCAL;

export const API_URL = {
  auth: {
    login: `${BASE_URL}/auth/login`,
  },
  usuarios: {
    findAll: `${BASE_URL}/usuario/find-all`,
    findOne: (id: number) => `${BASE_URL}/usuario/find-one/${id}`,
    create: `${BASE_URL}/usuario/create`,
    update: (id: number) => `${BASE_URL}/usuario/update/${id}`,
    delete: (id: number) => `${BASE_URL}/usuario/delete/${id}`,
  },
  vehiculos: {
    findAll: `${BASE_URL}/vehiculo/find-all`,
    findOne: (id: number) => `${BASE_URL}/vehiculo/find-one/${id}`,
    create: `${BASE_URL}/vehiculo/create`,
    update: (id: number) => `${BASE_URL}/vehiculo/update/${id}`,
    delete: (id: number) => `${BASE_URL}/vehiculo/delete/${id}`,
  },
  conductores: {
    findAll: `${BASE_URL}/conductor/find-all`,
    findOne: (id: number) => `${BASE_URL}/conductor/find-one/${id}`,
    create: `${BASE_URL}/conductor/create`,
    update: (id: number) => `${BASE_URL}/conductor/update/${id}`,
    delete: (id: number) => `${BASE_URL}/conductor/delete/${id}`,
  },
  vehiculosConductores: {
    findAll: `${BASE_URL}/vehiculo-conductor/find-all`,
    findOne: (id: number) => `${BASE_URL}/vehiculo-conductor/find-one/${id}`,
    create: `${BASE_URL}/vehiculo-conductor/create`,
    update: (id: number) => `${BASE_URL}/vehiculo-conductor/update/${id}`,
    delete: (id: number) => `${BASE_URL}/vehiculo-conductor/delete/${id}`,
  },
  mantenimientos: {
    findAll: `${BASE_URL}/mantenimiento/find-all`,
    findOne: (id: number) => `${BASE_URL}/mantenimiento/find-one/${id}`,
    create: `${BASE_URL}/mantenimiento/create`,
    update: (id: number) => `${BASE_URL}/mantenimiento/update/${id}`,
    delete: (id: number) => `${BASE_URL}/mantenimiento/delete/${id}`,
  },
  rutas: {
    findAll: `${BASE_URL}/ruta/find-all`,
    findOne: (id: number) => `${BASE_URL}/ruta/find-one/${id}`,
    create: `${BASE_URL}/ruta/create`,
    update: (id: number) => `${BASE_URL}/ruta/update/${id}`,
    delete: (id: number) => `${BASE_URL}/ruta/delete/${id}`,
  },
  viajes: {
    findAll: `${BASE_URL}/viaje/find-all`,
    findOne: (id: number) => `${BASE_URL}/viaje/find-one/${id}`,
    create: `${BASE_URL}/viaje/create`,
    update: (id: number) => `${BASE_URL}/viaje/update/${id}`,
    delete: (id: number) => `${BASE_URL}/viaje/delete/${id}`,
  },
  clientes: {
    findAll: `${BASE_URL}/cliente/find-all`,
    findOne: (id: number) => `${BASE_URL}/cliente/find-one/${id}`,
    create: `${BASE_URL}/cliente/create`,
    update: (id: number) => `${BASE_URL}/cliente/update/${id}`,
    delete: (id: number) => `${BASE_URL}/cliente/delete/${id}`,
  },
};
