import { Request, Response, NextFunction } from "express";
import { T } from "../libs/types/common";
import { LoginInput, Member } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service";
import { ProductInput, ProductUpdateInput } from "../libs/types/product";
import { ProductStatus } from "../libs/enums/product.enum";

const memberService = new MemberService();
const adminController: T = {};

const productService = new ProductService();


 //1. Admin Home sahifasini ochadi.
adminController.goHome = (req: Request, res: Response) => {
    res.render("home");
};

 // 2. Admin Login sahifasini ochadi.
adminController.getLogin = (req: Request, res: Response) => {
    res.render("login");
};
 //3. Login formdan kelgan nick/passwordni tekshiradi.
 

adminController.processLogin = async (
    req: Request,
    res: Response
) => {
    try {
        const input: LoginInput = req.body;

        // Mavjud MemberService.login()dan foydalanamiz.
        const member: Member = await memberService.login(input);

        // Oddiy USER admin panelga kira olmaydi.
        if (member.memberType !== MemberType.ADMIN) {
            throw new Errors(
                HttpCode.FORBIDDEN,
                Message.NOT_AUTHENTICATED
            );
        }

        // Admin ma'lumotini sessionga saqlaymiz.
        const sessionInstance = req.session as T;
        sessionInstance.member = member;

        req.session.save(() => {
            res.redirect("/admin");
        });
    } catch (err) {
        console.log("Error, processLogin:", err);

        // Hozircha sodda qilamiz.
        // Keyinchalik login.ejs ichida error message ko'rsatamiz.
        res.redirect("/admin/login");
    }
};

// 4. Admin sessionini o'chiradi.
adminController.logout = (
    req: Request,
    res: Response
) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
};

/**
 * 5. Admin EJS sahifalarini himoya qiladi.
 *
 * Bu JWT verifyAdmin'dan alohida:
 * - REST API → accessToken
 * - EJS Admin → session
 */
adminController.verifyAdminSession = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const sessionInstance = req.session as T;
    const member = sessionInstance.member as Member;

    if (
        member &&
        member.memberType === MemberType.ADMIN
    ) {
        return next();
    }

    return res.redirect("/admin/login");
};

/**
 * Admin uchun barcha productlarni olib,
 * products.ejs sahifasiga yuboradi.
 */
adminController.getProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const products =
            await productService.getAllProductsByAdmin();

        res.render("products", {
            products,
        });
    } catch (err) {
        console.log("Error, getProducts:", err);

        res.redirect("/admin");
    }
};

/**
 * Admin EJS panel orqali yangi product yaratadi.
 */
adminController.createProduct = async (
    req: Request,
    res: Response
) => {
    try {
        const input: ProductInput = req.body;

        if (req.files && Array.isArray(req.files)) {
            input.productImages = req.files.map(
                (file: Express.Multer.File) =>
                    file.path.replace(/\\/g, '/')
            );
        }

        await productService.createProduct(input);

        res.redirect("/admin/product/all");
    } catch (err) {
        console.log(
            "Error, Admin EJS createProduct:",
            err
        );

        res.redirect("/admin/product/all");
    }
};


adminController.updateProduct = async (
    req: Request,
    res: Response
) => {
    try {
        // 1. URL ichidan product IDni olamiz.
        // Masalan:
        // /admin/product/update/6a908d96531ab0cfe319518e
        const productId = req.params.id as string;

        // 2. Edit formdan kelgan yangi ma'lumotlar.
        const input: ProductUpdateInput = req.body;

        // 3. Agar admin yangi rasm tanlagan bo'lsa,
        // multer ularni req.files ichiga joylaydi.
        if (
            req.files &&
            Array.isArray(req.files) &&
            req.files.length > 0
        ) {
            input.productImages = req.files.map(
                (file: Express.Multer.File) =>
                    file.path.replace(/\\/g, "/")
            );
        }

        // 4. Mavjud service orqali productni yangilaymiz.
        await productService.updateProduct(
            productId,
            input
        );

        // 5. JSON qaytarmaymiz.
        // EJS Products sahifasiga qaytamiz.
        res.redirect("/admin/product/all");

    } catch (err) {
        console.log(
            "Error, Admin EJS updateProduct:",
            err
        );

        res.redirect("/admin/product/all");
    }
};



adminController.deleteProduct = async (
    req: Request,
    res: Response
) => {
    try {

        // 1. URL paramsdan product id olamiz.
        //
        // POST /admin/product/delete/123
        //
        // req.params.id => "123"
        const productId = req.params.id as string;


        // 2. Mavjud updateProduct service methodidan
        // foydalanamiz.
        //
        // Productni MongoDBdan o'chirmaymiz.
        // Faqat statusini DELETE qilamiz.
        await productService.updateProduct(
            productId,
            {
                productStatus: ProductStatus.DELETE
            }
        );


        // 3. Update tugagandan keyin
        // Products sahifasiga qaytamiz.
        res.redirect("/admin/product/all");

    } catch (err) {

        console.log(
            "Error, Admin EJS deleteProduct:",
            err
        );

        res.redirect("/admin/product/all");
    }
};

export default adminController;