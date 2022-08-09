import {
   getStorage,
   ref,
   deleteObject,
   getDownloadURL,
   listAll,
   uploadBytes,
} from 'firebase/storage'

export default function useStorage() {
   const storage = getStorage()

   const getFileUrl = async (filePath) => {
      return new Promise(async (res, rej) => {
         try {
            const storageRef = ref(storage, filePath)
            const url = await getDownloadURL(storageRef)
            res(url)
         } catch (error) {
            console.error('getFileUrl', error.message)
            rej(error)
         }
      })
   }

   const deleteFile = async (filePath) => {
      return new Promise(async (res, rej) => {
         try {
            const storageRef = ref(storage, filePath)
            await deleteObject(storageRef)
            res()
         } catch (error) {
            rej(error)
         }
      })
   }

   const listFiles = async (parent) => {
      return new Promise(async (res, rej) => {
         try {
            const storageRef = ref(storage, parent)
            const files = await listAll(storageRef)
            res(files)
         } catch (error) {
            rej(error)
         }
      })
   }

   const uploadFile = async ({ parent, file }) => {
      return new Promise(async (res, rej) => {
         try {
            const filePath = `${parent}/${file.name}`
            const storageRef = ref(storage, filePath)
            const snapshot = await uploadBytes(storageRef, file)
            const url = await getFileUrl(snapshot.metadata.fullPath)
            res({ path: snapshot.metadata.fullPath, url })
         } catch (error) {
            console.error('uploadFile', error.message)
            rej(error)
         }
      })
   }

   return {
      deleteFile,
      getFileUrl,
      listFiles,
      uploadFile,
   }
}
