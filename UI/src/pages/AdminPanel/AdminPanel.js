// import React from 'react'
// import { Admin, fetchUtils, Resource,withLifecycleCallbacks } from 'react-admin'
// import simpleRestProvider from "ra-data-simple-rest";
// import ProductList from './ProductList';
// import EditProduct from './EditProduct';
// import CreateProduct from './CreateProduct';
// import CategoryList from './Category/CategoryList';
// import CategoryEdit from './Category/CategoryEdit';
// import { fileUploadAPI } from '../../api/fileUpload';

// const CDN_URL = 'https://codedev.b-cdn.net';

// const httpClient = (url,options={})=>{

//   const token = localStorage.getItem('authToken');
//   if(!options.headers) options.headers = new Headers();
//   options.headers.set('Authorization',`Bearer ${token}`);
//   return fetchUtils.fetchJson(url,options);
// }

// const dataProvider = withLifecycleCallbacks(simpleRestProvider('http://localhost:8080/api',httpClient),[
//   {
//     resource:"products",
//     beforeSave: async (params,dataProvider) =>{
//       console.log("Params ",params);
//       let requestBody = {
//         ...params
//       }
//       let productResList = params?.productResources ?? [];
//       const fileName = params?.thumbnail?.rawFile?.name?.replaceAll(' ','-');
//       const formData = new FormData();
//       formData.append("file",params?.thumbnail?.rawFile);
//       formData.append("fileName",fileName);

//       const thumbnailResponse = await fileUploadAPI(formData);
//       requestBody.thumbnail = CDN_URL+"/"+fileName;

    
//       const newProductResList = await Promise.all(productResList?.map(async (productResource)=>{
//         const fileName = productResource?.url?.rawFile?.name?.replaceAll(' ','-');
//         const formData = new FormData();
//         formData.append("file",productResource?.url?.rawFile);
//         formData.append("fileName",fileName);
//         const fileUploadRes = await fileUploadAPI(formData);
//         return {
//           ...productResource,
//           url:CDN_URL+"/"+fileName,
//         };
//       }));
//       //console.log("Params ",params,fileName);
//       const request = {
//         ...requestBody,
//         productResources:newProductResList
//       }
//       console.log("Request Body ",request);
//       return request;
//     }
//   }
// ]);

// export const AdminPanel = () => {
//   return (
//     <Admin dataProvider={dataProvider} basename='/admin'>
//       <Resource name='products' list={ProductList} edit={EditProduct} create={CreateProduct}/>
//       <Resource name='category' list={CategoryList} edit={CategoryEdit}/>
//     </Admin>
//   )
// }
import React from 'react'
import { Admin, fetchUtils, Resource, withLifecycleCallbacks } from 'react-admin'
import simpleRestProvider from "ra-data-simple-rest";
import ProductList from './ProductList';
import EditProduct from './EditProduct';
import CreateProduct from './CreateProduct';
import CategoryList from './Category/CategoryList';
import CategoryEdit from './Category/CategoryEdit';
import { fileUploadAPI } from '../../api/fileUpload';

// NOTE: CDN_URL ab fixed nahi hai kyunki backend se URL aayega dynamically

const httpClient = (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  if (!options.headers) options.headers = new Headers();
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
}

const dataProvider = withLifecycleCallbacks(simpleRestProvider('http://localhost:8080/api', httpClient), [
  {
    resource: "products",
    beforeSave: async (params, dataProvider) => {
      console.log("Params ", params);
      let requestBody = {
        ...params
      }
      let productResList = params?.productResources ?? [];

      // Upload thumbnail file and get URL from backend response
      const thumbnailFile = params?.thumbnail?.rawFile;
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const fileName = thumbnailFile.name.replaceAll(' ', '-');
        const thumbnailResponse = await fileUploadAPI(thumbnailFile, fileName); 
        thumbnailUrl = thumbnailResponse;
      }
      requestBody.thumbnail = thumbnailUrl;

      // Upload each product resource file and get URLs
      const newProductResList = await Promise.all(productResList.map(async (productResource) => {
        const resourceFile = productResource?.url?.rawFile;
        if (resourceFile) {
          const fileName = resourceFile.name.replaceAll(' ', '-');
          const fileUploadRes = await fileUploadAPI(resourceFile, fileName);
          return {
            ...productResource,
            url: fileUploadRes,
          };
        }
        return productResource;
      }));

      const request = {
        ...requestBody,
        productResources: newProductResList
      }
      console.log("Request Body ", request);
      return request;
    }
  }
]);

export const AdminPanel = () => {
  return (
    <Admin dataProvider={dataProvider} basename='/admin'>
      <Resource name='products' list={ProductList} edit={EditProduct} create={CreateProduct} />
      <Resource name='category' list={CategoryList} edit={CategoryEdit} />
    </Admin>
  )
}

