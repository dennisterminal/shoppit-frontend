import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "../product/RelatedProducts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../api";
import api from "../../api";
import { toast } from "react-toastify";

const ProductPage = ({ updateCartCount }) => { // Changed from setNumberCartItems to updateCartCount
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(
    function () {
      if (product.id && cart_code) {
        api
          .get(
            `product_in_cart?cart_code=${cart_code}&product_id=${product.id}`,
          )
          .then((res) => {
            console.log(res.data);
            setInCart(res.data.product_in_cart);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    },
    [cart_code, product.id],
  );

  const newItem = { cart_code: cart_code, product_id: product.id };

  function add_item() {
    api
      .post("add_item/", newItem)
      .then((res) => {
        console.log(res.data);
        setInCart(true);
        toast.success("Product added to cart successfully!");
        
        // Call updateCartCount instead of setNumberCartItems
        if (updateCartCount && typeof updateCartCount === 'function') {
          updateCartCount();
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Failed to add product to cart!");
      });
  }

  useEffect(
    function () {
      setLoading(true);
      // Fetch product data based on slug
      api.get(`/product_detail/${slug}`).then((response) => {
        // Handle the response data
        console.log(response.data);
        setProduct(response.data);
        setSimilarProducts(response.data.similar_products);
        setLoading(false);
      });
    },
    [slug],
  );

  if (loading) {
    return <ProductPagePlaceHolder />;
  }

  return (
    <div>
      <section className="py-3">
        <div className="container px-4 px-lg-5 mt-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col mb-6">
              <img
                className="card-img-top mb-5 mb-md-0"
                src={`${BASE_URL}${product.image}`}
                alt="..."
              />
            </div>
            <div className="col-md-6">
              <div className="small mb-1">SKU: BST-498</div>
              <h1 className="display-5 fw-bolder">{product.name}</h1>
              <div className="fs-5 mb-5">
                <span>{`$${product.price}`}</span>
              </div>
              <p className="lead">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium dolore rerum laborum iure enim sint nemo omnis
                voluptate exercitationem eius?
              </p>
              <div className="d-flex">
                <button
                  className="btn btn-outline-dark flex-shrink-0"
                  type="button"
                  onClick={add_item}
                  disabled={inCart}
                >
                  <i className="bi-cart-fill me-1"></i>
                  {inCart ? "Product added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RelatedProducts products={similarProducts} />
    </div>
  );
};

export default ProductPage;