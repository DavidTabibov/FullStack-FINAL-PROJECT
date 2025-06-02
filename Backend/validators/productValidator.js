import Joi from 'joi';

// Schema for product creation validation
const createProductSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Product name must contain at least 2 characters',
            'string.max': 'Product name cannot contain more than 100 characters',
            'any.required': 'Product name is required'
        }),
    
    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Product description must contain at least 10 characters',
            'string.max': 'Product description cannot contain more than 1000 characters',
            'any.required': 'Product description is required'
        }),
    
    brand: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Brand name must contain at least 2 characters',
            'string.max': 'Brand name cannot contain more than 50 characters',
            'any.required': 'Brand name is required'
        }),
    
    category: Joi.string()
        .valid('men', 'women', 'kids', 'accessories')
        .required()
        .messages({
            'any.only': 'Category must be one of: men, women, kids, accessories',
            'any.required': 'Category is required'
        }),
    
    subcategory: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Subcategory must contain at least 2 characters',
            'string.max': 'Subcategory cannot contain more than 50 characters',
            'any.required': 'Subcategory is required'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.positive': 'Price must be a positive number',
            'any.required': 'Price is required'
        }),
    
    salePrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.positive': 'Sale price must be a positive number'
        }),
    
    images: Joi.array()
        .items(Joi.string().uri())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one image is required',
            'any.required': 'Images are required'
        }),
    
    sizes: Joi.array()
        .items(
            Joi.object({
                size: Joi.string().required(),
                quantity: Joi.number().integer().min(0).required()
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one size is required',
            'any.required': 'Sizes are required'
        }),
    
    colors: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                code: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one color is required',
            'any.required': 'Colors are required'
        }),
    
    countInStock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.min': 'Stock count cannot be negative',
            'any.required': 'Stock count is required'
        }),
    
    isFeatured: Joi.boolean().optional(),
    isNew: Joi.boolean().optional(),
    isSale: Joi.boolean().optional()
});

// Schema for product update validation
const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Product name must contain at least 2 characters',
            'string.max': 'Product name cannot contain more than 100 characters'
        }),
    
    description: Joi.string()
        .min(10)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'Product description must contain at least 10 characters',
            'string.max': 'Product description cannot contain more than 1000 characters'
        }),
    
    brand: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Brand name must contain at least 2 characters',
            'string.max': 'Brand name cannot contain more than 50 characters'
        }),
    
    category: Joi.string()
        .valid('men', 'women', 'kids', 'accessories')
        .optional()
        .messages({
            'any.only': 'Category must be one of: men, women, kids, accessories'
        }),
    
    subcategory: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Subcategory must contain at least 2 characters',
            'string.max': 'Subcategory cannot contain more than 50 characters'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.positive': 'Price must be a positive number'
        }),
    
    salePrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.positive': 'Sale price must be a positive number'
        }),
    
    images: Joi.array()
        .items(Joi.string().uri())
        .min(1)
        .optional()
        .messages({
            'array.min': 'At least one image is required'
        }),
    
    sizes: Joi.array()
        .items(
            Joi.object({
                size: Joi.string().required(),
                quantity: Joi.number().integer().min(0).required()
            })
        )
        .min(1)
        .optional()
        .messages({
            'array.min': 'At least one size is required'
        }),
    
    colors: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                code: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
            })
        )
        .min(1)
        .optional()
        .messages({
            'array.min': 'At least one color is required'
        }),
    
    countInStock: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.min': 'Stock count cannot be negative'
        }),
    
    isFeatured: Joi.boolean().optional(),
    isNew: Joi.boolean().optional(),
    isSale: Joi.boolean().optional()
});

export { createProductSchema, updateProductSchema };

// פונקציות וולידציה
export const validateCreateProduct = (productData) => {
    return createProductSchema.validate(productData, { abortEarly: false });
};

export const validateUpdateProduct = (updateData) => {
    return updateProductSchema.validate(updateData, { abortEarly: false });
}; 