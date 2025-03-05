export interface PromotionDepartmentItems {
    id: number
    promotionId: number
    deptId: number
    deptIdCode: string
    deptIdName: string
    promotionName: string
    promotionCode: string
    discountAmount: number
    discountType: string
}

export interface PromotionTypeItems {
    id: number
    promotionId: number
    typeId: number
    typeCode: string
    typeName: string
    promotionName: string
    promotionCode: string
    discountAmount: number
    discountType: string
}

export interface Promotion {
    id: number
    promotionName: string
    promotionCode: string
    promotionType: string
    description: string
    periodStart: string
    periodEnd: string
    online: number
    inStore: number
    member: number
    afterBeforeTax: number
    discount: number
    discountType: string
    allOneDiscount: number
    couponRequest: number
    couponMainCode: string
    remark: string
    promotionDepartmentItems: PromotionDepartmentItems[]
    promotionTypeItems: PromotionTypeItems[]
}

export interface PromotionStateFace {
    list: Promotion[]
}

export const promotionState: PromotionStateFace  = {
    list: []
}


// Carts

export interface CartFace {
    productId: number
    productName: string
    productCode: string
    qty: number
    price: string
    taxRate: number
    taxAmount: number
    finalPrice: number
    typeId: number
    typeName: string
    deptId: number
    deptName: string
    unit: string
    itemCode: string
    brandName: string
}

export interface CartStateFace {
    list: CartFace[]
}

export const cartState: CartStateFace  = {
    list: []
}
