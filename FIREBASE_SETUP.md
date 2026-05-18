# Configuración de Firebase Firestore

## Pasos para configurar Firestore Rules

1. **Ir a Firebase Console**
   - Ve a: https://console.firebase.google.com
   - Selecciona tu proyecto: "etitcsports"

2. **Configurar Firestore Rules**
   - En el panel izquierdo: Firestore Database → Rules
   - Reemplaza las reglas existentes con el contenido de `firestore.rules`
   - Publica las reglas

## Contenido de las Reglas (firestore.rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /torneos/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Pasos para crear la colección (si no existe)

1. **Desde Firebase Console:**
   - Firestore Database → Crear colección
   - Nombre de la colección: `torneos`
   - Crear documento de prueba (opcional)
   - O la colección se creará automáticamente cuando guardes el primer torneo

## Verificar en Console del Navegador

Después de crear las reglas:
1. Abre DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta crear un torneo nuevamente
4. Los errores mostrarán exactamente qué está fallando

## Errores Comunes

- **"Permission denied"**: Las reglas de Firestore no permiten la operación. Actualiza `firestore.rules`
- **"Collection not found"**: Normal - se crea automáticamente al guardar el primer documento
- **"Authentication required"**: Verifica que las reglas no requieran autenticación (si no tienes login configurado)

## Después de Configurar

Una vez que hayas actualizado las reglas en Firebase Console, el error debería desaparecer y los torneos se guardarán correctamente en la colección "torneos".
