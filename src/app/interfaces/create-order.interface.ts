
export interface CreateOrder{
    EmpId:number
    ShipperId: number
    ShipName:string
    ShipAddress:string
    ShipCity:string
    OrderDate:Date
    RequiredDate:Date
    ShippedDate:Date
    Freight:number
    ShipCountry:string
    ProductId:number
    UnitPrice:number
    Qty:number
    Discount:number
}