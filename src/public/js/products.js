/**
 * BAZZAR ADMIN - PRODUCTS
 *
 * Bu fayl Admin Products sahifasidagi
 * Create / Edit rejimlarini boshqaradi.
 *
 * Edit bosilganda:
 *
 * Product table
 *      ↓
 * Edit button ichidagi data-* ma'lumotlari
 *      ↓
 * Product form
 *      ↓
 * Create rejimidan Edit rejimiga o'tadi
 */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // 1. KERAKLI HTML ELEMENTLARNI TOPAMIZ
    // =====================================================

    // Create / Edit uchun ishlatiladigan umumiy form.
    const productForm =
        document.getElementById("product-form");

    // Form tepasidagi:
    // "Create New Product" / "Edit Product"
    const formTitle =
        document.getElementById("product-form-title");

    // Create Product / Update Product button.
    const submitButton =
        document.getElementById("product-submit-btn");

    // Status joylashgan form-group.
    //
    // Create rejimida yashirin.
    // Edit rejimida ko'rinadi.
    const statusGroup =
        document.getElementById("product-status-group");

    // Barcha productlarning Edit buttonlari.
    const editButtons =
        document.querySelectorAll(".edit-btn");


    // =====================================================
    // 2. HAR BIR EDIT BUTTON UCHUN CLICK EVENT
    // =====================================================

    editButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // =============================================
            // 3. BUTTON ICHIDAGI PRODUCT MA'LUMOTLARI
            // =============================================
            //
            // products.ejs ichida:
            //
            // data-id="..."
            // data-name="..."
            // data-price="..."
            // data-status="..."
            //
            // qilib berganmiz.
            //
            // JSda ularni:
            //
            // button.dataset.id
            // button.dataset.name
            //
            // orqali olamiz.

            const productId =
                button.dataset.id;

            const productName =
                button.dataset.name;

            const productCollection =
                button.dataset.collection;

            const productPrice =
                button.dataset.price;

            const productStock =
                button.dataset.stock;

            const productUnit =
                button.dataset.unit;

            const productVolume =
                button.dataset.volume;

            const productDesc =
                button.dataset.desc;

            // YANGI:
            // Productning hozirgi statusini ham olamiz.
            const productStatus =
                button.dataset.status;


            // =================================================
            // 4. FORM ACTIONNI UPDATE ROUTEGA O'ZGARTIRAMIZ
            // =================================================
            //
            // Create rejimida:
            //
            // POST /admin/product/create
            //
            // Edit bosilgandan keyin:
            //
            // POST /admin/product/update/:id

            productForm.action =
                `/admin/product/update/${productId}`;


            // =================================================
            // 5. PRODUCT MA'LUMOTLARINI FORMGA JOYLAYMIZ
            // =================================================

            productForm.elements["productName"].value =
                productName || "";

            productForm.elements["productCollection"].value =
                productCollection || "";

            productForm.elements["productPrice"].value =
                productPrice || "";

            productForm.elements["productLeftCount"].value =
                productStock || "";

            productForm.elements["productUnit"].value =
                productUnit || "";

            productForm.elements["productVolume"].value =
                productVolume || "";

            productForm.elements["productDesc"].value =
                productDesc || "";


            // =================================================
            // 6. PRODUCT STATUSNI FORMGA JOYLAYMIZ
            // =================================================
            //
            // Masalan DBda:
            //
            // productStatus = "PROCESS"
            //
            // bo'lsa select avtomatik PROCESSni tanlaydi.

            productForm.elements["productStatus"].value =
                productStatus || "PAUSE";


            // =================================================
            // 7. STATUS SELECTNI KO'RSATAMIZ
            // =================================================
            //
            // Create rejimida:
            //
            // display: none
            //
            // edi.
            //
            // Edit bosilganda:
            //
            // display: flex
            //
            // bo'ladi.

            statusGroup.style.display = "flex";


            // =================================================
            // 8. FORMNI EDIT REJIMIGA O'TKAZAMIZ
            // =================================================

            formTitle.textContent =
                "Edit Product";

            submitButton.textContent =
                "Update Product";


            // =================================================
            // 9. FORM JOYLASHGAN QISMGA SCROLL QILAMIZ
            // =================================================

            document
                .getElementById("create-product")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    });

});