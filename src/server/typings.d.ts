// Allow importing of JSON Schemas
declare module "*.schema" {
    const value: any;
    export default value;
}