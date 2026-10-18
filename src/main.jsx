import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShoppingBag, Search, Heart, ArrowRight, Menu, X, Minus, Plus,
  ShieldCheck, Truck, RotateCcw, ArrowLeft, LockKeyhole,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import './style.css';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"><rect width="700" height="700" fill="#f2f0ec"/><text x="350" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="#292929">SURPLIX</text><text x="350" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#777">Product image coming soon</text></svg>');

// Ten clearly marked display-only products. They are NOT stored in Supabase.
// Third-party retail reference photos are for PRIVATE MOCKUP ONLY. Obtain usage rights or replace with your own photos BEFORE publishing.
const DEMO_PRODUCTS = [
  { id: 'demo-1', name: 'Velocity Running Sneaker', brand: 'AeroStep', kind: 'Sneakers', price: 39.99, compare: 39.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop', sizes: ['7','8','9','10','11'], description: 'Illustrative running shoe. Brand, price and availability are fictional.' },
  { id: 'demo-2', name: 'Urban Classic Trainer', brand: 'Northline', kind: 'Sneakers', price: 37.99, compare: 39.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&auto=format&fit=crop', sizes: ['8','9','10','11','12'], description: 'Illustrative streetwear trainer; not a product listing.' },
  { id: 'demo-3', name: 'Minimal White Sneaker', brand: 'Forma Studio', kind: 'Sneakers', price: 34.99, compare: 39.99, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=700&auto=format&fit=crop', sizes: ['7','8','9','10'], description: 'Illustrative everyday sneaker; not available for purchase.' },
  { id: 'demo-4', name: 'Essential Pullover Hoodie', brand: 'Haven Supply', kind: 'Clothing', price: 29.99, compare: 39.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop', sizes: ['S','M','L','XL'], description: 'Illustrative casual hoodie; not stocked.' },
  { id: 'demo-5', name: 'Everyday Cotton Tee', brand: 'Cedar & Co.', kind: 'Clothing', price: 14.99, compare: 24.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&auto=format&fit=crop', sizes: ['S','M','L','XL'], description: 'Illustrative T-shirt; not stocked.' },
  { id: 'demo-6', name: 'Modern Street Jacket', brand: 'District Eleven', kind: 'Clothing', price: 39.99, compare: 39.99, image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=700&auto=format&fit=crop', sizes: ['M','L','XL'], description: 'Illustrative jacket; not stocked.' },
  { id: 'demo-7', name: 'Classic White Thobe', brand: 'Safa Atelier', kind: 'Islamic Menswear', price: 34.99, compare: 39.99, image: 'https://www.bakkah.us/cdn/shop/files/file_5_62-removebg.png?v=1698950175&width=1426', sizes: ['52','54','56','58','60'], description: 'Reference-photo preview for a traditional men’s thobe. No physical inventory.' },
  { id: 'demo-8', name: 'Midnight Navy Jubba', brand: 'Noor Heritage', kind: 'Islamic Menswear', price: 39.99, compare: 39.99, image: 'https://www.junaidjamshed.com/cdn/shop/files/jj-jubba-33185_77242512-eb5a-4494-b149-79bcb2fd9b1f.jpg?v=1776977724&width=880', sizes: ['52','54','56','58','60'], description: 'Reference-photo preview for a men’s jubba. No physical inventory.' },
  { id: 'demo-9', name: 'Sandstone Embroidered Kameez', brand: 'Alif Collective', kind: 'Islamic Menswear', price: 32.99, compare: 39.99, image: 'https://www.hayabyrabi.com/cdn/shop/files/2_955b0c4b-dd18-456b-9b3c-00159c55305b.jpg?v=1717507385', sizes: ['S','M','L','XL'], description: 'Reference-photo preview for a men’s traditional kameez. No physical inventory.' },
  { id: 'demo-10', name: 'Ivory Prayer Kufi', brand: 'Barakah Basics', kind: 'Islamic Menswear', price: 9.99, compare: 14.99, image: 'https://img.fruugo.com/product/6/21/1840899216_max.jpg', sizes: ['S','M','L'], description: 'Reference-photo preview for a men’s kufi cap. No physical inventory.' },
  { id: 'demo-11', name: 'Royal Blue Prayer Mat', brand: 'SURPLIX Preview', kind: 'Prayer Mats', price: 9.99, compare: null, image: 'https://www.sevensajada.com/cdn/shop/products/Premium_Elegant_Prayer_Mat_Blue_1_1400x.jpg?v=1649577070', sizes: ['One size'], description: 'Reference photograph only. This mat is not SURPLIX inventory.' },
  { id: 'demo-12', name: 'Soft Grey Prayer Mat', brand: 'SURPLIX Preview', kind: 'Prayer Mats', price: 7.99, compare: null, image: 'https://media.homecentre.com/i/homecentre/168762388-168762388-HC20012026_01-2100.jpg?fmt=auto', sizes: ['One size'], description: 'Reference photograph only. This mat is not SURPLIX inventory.' },
  { id: 'demo-13', name: 'Golden Mihrab Prayer Mat', brand: 'SURPLIX Preview', kind: 'Prayer Mats', price: 8.99, compare: null, image: 'https://sadecollection.com/cdn/shop/files/Photoroom_20251011_001540.jpg?v=1760156379', sizes: ['One size'], description: 'Reference photograph only. This mat is not SURPLIX inventory.' },
].map((item) => ({ ...item, isDemo: true, stockQuantity: 0 }));

const fmt = (value) => new Intl.NumberFormat('en-CA', {
  style: 'currency', currency: 'CAD',
}).format(Number(value) || 0);

function normalizeProduct(row) {
  const sizes = Array.isArray(row.sizes)
    ? row.sizes
    : String(row.sizes || '').split(',').map((size) => size.trim()).filter(Boolean);
  const price = Number(row.price) || 0;
  return {
    id: row.id,
    name: row.name || 'Unnamed product',
    description: row.description || '',
    kind: row.category || 'Other',
    brand: row.brand || '',
    price,
    compare: null,
    image: row.image_url?.trim() || PLACEHOLDER_IMAGE,
    sizes: sizes.length ? sizes : ['One size'],
    stockQuantity: Number(row.stock_quantity) || 0,
    isDemo: false,
  };
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailSize, setDetailSize] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [checkoutFields, setCheckoutFields] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', apartment: '', city: '', province: '', postalCode: '' });
  const [likes, setLikes] = useState([]);
  const [menu, setMenu] = useState(false);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError('');
        const { data, error } = await supabase
          .from('products')
          .select('id,name,description,price,category,brand,sizes,stock_quantity,image_url,is_active')
          .eq('is_active', true)
          .order('id', { ascending: true });
        if (error) throw error;
        if (!cancelled) setItems((data || []).map(normalizeProduct));
      } catch (error) {
        console.error('SURPLIX product loading failed:', error);
        if (!cancelled) setLoadError('We could not load the catalogue. Please refresh the page or try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const catalogue = useMemo(() => [...items, ...DEMO_PRODUCTS], [items]);
  const categories = useMemo(() => ['All', ...new Set(catalogue.map((item) => item.kind))], [catalogue]);
  const shown = useMemo(() => {
    const result = catalogue.filter((item) =>
      (filter === 'All' || item.kind === filter) &&
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [catalogue, filter, query, sort]);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  function add(product, chosenSize) {
    const size = chosenSize || selections[product.id] || product.sizes[0];
    const key = `${product.id}-${size}`;
    setCart((current) => current.some((item) => item.key === key)
      ? current.map((item) => item.key === key ? { ...item, qty: item.qty + 1 } : item)
      : [...current, { ...product, key, size, qty: 1 }]);
    setDrawer(true);
  }
  const checkoutEligible = cart.length === 1 &&
    !cart[0].isDemo &&
    Number.isSafeInteger(cart[0].id) &&
    cart[0].qty >= 1 && cart[0].qty <= 10 &&
    cart[0].qty <= cart[0].stockQuantity;

  async function startStripeCheckout() {
    if (!checkoutEligible || paymentBusy) return;
    setPaymentError('');
    setPaymentBusy(true);
    try {
      // The backend fetches the authoritative price and inventory from Supabase.
      // Never send a Stripe secret key, product price or payment-card details here.
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { productId: cart[0].id, quantity: cart[0].qty },
      });
      if (error) throw error;
      if (!data?.success || data?.mode !== 'test' || !data?.checkoutUrl) {
        throw new Error(data?.error || 'Could not create a test checkout session.');
      }
      const checkout = new URL(data.checkoutUrl);
      if (checkout.protocol !== 'https:' || checkout.hostname !== 'checkout.stripe.com') {
        throw new Error('Unexpected payment destination.');
      }
      window.location.assign(checkout.href);
    } catch (error) {
      console.error('SURPLIX sandbox checkout:', error);
      setPaymentError('Unable to start Stripe test checkout. Please try again.');
      setPaymentBusy(false);
    }
  }

  function updateCheckoutField(event) {
    const { name, value } = event.target;
    setCheckoutFields((current) => ({ ...current, [name]: value }));
  }
  function remove(key) { setCart((current) => current.filter((item) => item.key !== key)); }
  function openDetail(product) {
    setDetail(product);
    setDetailSize(selections[product.id] || product.sizes[0]);
  }
  function change(key, delta) {
    setCart((current) => current.map((item) =>
      item.key === key ? { ...item, qty: item.qty + delta } : item
    ).filter((item) => item.qty > 0));
  }

  return <>
    <div className="top">CANADA-WIDE SHIPPING <span>•</span> NEW ARRIVALS COMING SOON</div>
    <header>
      <a className="brand" href="#home">SURPLI<span>X</span><small>OUTLET</small></a>
      <nav className={menu ? 'open' : ''}>
        <a href="#shop" onClick={() => { setFilter('All'); setMenu(false); }}>Shop all</a>
        <a href="#shop" onClick={() => { setFilter('Sneakers'); setMenu(false); }}>Sneakers</a>
        <a href="#shop" onClick={() => { setFilter('Clothing'); setMenu(false); }}>Clothing</a>
        <a href="#shop" onClick={() => { setFilter('Islamic Menswear'); setMenu(false); }}>Islamic Menswear</a>
        <a href="#shop" onClick={() => { setFilter('Prayer Mats'); setMenu(false); }}>Prayer Mats</a>
        <a href="#about" onClick={() => setMenu(false)}>Our story</a>
      </nav>
      <div className="head-actions">
        <button aria-label="Open shopping bag" onClick={() => setDrawer(true)}><ShoppingBag size={21}/><span className="count">{count}</span></button>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      </div>
    </header>
    <main id="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE EVERYDAY OUTLET</span>
          <h1>YOUR STYLE.<br/><em>YOUR PRICE.</em></h1>
          <p>Curated fashion finds, everyday essentials and standout footwear. Discover more, spend less.</p>
          <a href="#shop" className="cta">EXPLORE THE COLLECTION <ArrowRight size={17}/></a>
          <div className="hero-foot">A fresh Canadian shopping destination.</div>
        </div>
        <div className="hero-photo" role="img" aria-label="Streetwear fashion display"/>
      </section>
      <div className="perks">
        <div><ShieldCheck/> Authenticity matters</div>
        <div><Truck/> Canada-wide delivery planned</div>
        <div><RotateCcw/> Clear returns policy before launch</div>
      </div>
      <section className="shop" id="shop">
        <div className="section-top">
          <div>
            <div className="eyebrow orange">CURATED FINDS</div>
            <h2>Find your next favourite.</h2>
            <p>Explore our preview collection, including traditional Islamic menswear and prayer mats. Demo products are illustrative only; verified merchandise will be added before launch.</p>
          </div>
          <span className="demo">DEMO CATALOGUE</span>
        </div>
        <div className="controls">
          <div className="tabs">{categories.map((category) =>
            <button key={category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}>{category}</button>
          )}</div>
          <div className="searchbox"><Search size={17}/><input aria-label="Search catalogue" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products"/></div>
          <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        {loading && <p role="status">Loading products from SURPLIX...</p>}
        {!loading && loadError && <p role="alert">{loadError} Displaying concept products only.</p>}
        {!loading && <>
          <div className="grid">{shown.map((product) => <article className="product" key={product.id}>
            <div className="product-photo" onClick={() => openDetail(product)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') openDetail(product); }} aria-label={'View details for ' + product.name}>
              <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { if (event.currentTarget.src !== PLACEHOLDER_IMAGE) event.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
              <span className="sale">{product.isDemo ? 'DEMO' : 'PREVIEW'}</span>
              <button className={'heart ' + (likes.includes(product.id) ? 'liked' : '')} aria-label={'Save ' + product.name} onClick={(event) => { event.stopPropagation(); setLikes((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]); }}>
                <Heart size={19} fill={likes.includes(product.id) ? 'currentColor' : 'none'}/>
              </button>
            </div>
            <div className="product-body">
              <span className="kind">{product.brand ? `${product.brand} · ` : ''}{product.kind}</span>
              <h3><button className="product-title" onClick={() => openDetail(product)}>{product.name}</button></h3>
              <div className="prices"><b>{fmt(product.price)}</b>{product.compare != null && product.compare > product.price && <s>{fmt(product.compare)}</s>}</div>
              <label className="size-label">Size <select value={selections[product.id] || product.sizes[0]} onChange={(event) => setSelections((current) => ({ ...current, [product.id]: event.target.value }))}>
                {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select></label>
              <button className="add" onClick={() => add(product)}>ADD TO DEMO BAG <Plus size={16}/></button>
            </div>
          </article>)}</div>
          {shown.length === 0 && <p>No products match your search.</p>}
        </>}
        <p className="disclaimer">Storefront preview: thirteen illustrative demo products plus any active Supabase products. Demo brands, products and prices are fictional; reference photos do not represent stocked inventory. Real purchases are disabled; sandbox checkout is available only for eligible Supabase products.</p>
      </section>
      <section id="about" className="about">
        <div><span className="eyebrow orange">THE SURPLIX PROMISE</span><h2>Big style.<br/>Less spend.</h2></div>
        <p>We're building a Canadian online outlet focused on affordable, authentic fashion and footwear. We're not affiliated with any manufacturer unless expressly stated. Stay tuned for our official launch.</p>
      </section>
    </main>
    <footer>
      <div className="brand">SURPLI<span>X</span></div>
      <p>Big Brands. Smaller Prices.</p>
      <p>Contact us: <a href="tel:+12899695654" style={{ color: 'inherit', textDecoration: 'underline' }}>289-969-5654</a></p>
      <small>© {new Date().getFullYear()} SURPLIX. Storefront preview — not yet open for sales.</small>
    </footer>
    {detail && <div className="overlay detail-overlay" onClick={() => setDetail(null)}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-label={detail.name} onClick={(event) => event.stopPropagation()}>
        <button className="detail-close" onClick={() => setDetail(null)} aria-label="Close product details"><X/></button>
        <div className="detail-image"><img src={detail.image} alt={detail.name} onError={(event) => { if (event.currentTarget.src !== PLACEHOLDER_IMAGE) event.currentTarget.src = PLACEHOLDER_IMAGE; }}/><span className="sale">{detail.isDemo ? 'DEMO CONCEPT' : 'PRODUCT PREVIEW'}</span></div>
        <div className="detail-info">
          <span className="eyebrow orange">SURPLIX COLLECTION</span>
          <h2>{detail.name}</h2>
          <p className="detail-kind">{detail.brand ? `${detail.brand} · ` : ''}{detail.kind} · {detail.isDemo ? 'Illustrative concept' : 'Preview item'}</p>
          <div className="prices"><b>{fmt(detail.price)}</b>{detail.compare != null && detail.compare > detail.price && <s>{fmt(detail.compare)}</s>}</div>
          <p>{detail.description || 'Actual brand, condition, material, fit, photographs, availability and pricing will be verified before launch.'}</p>
          <label className="detail-size">Choose size<select value={detailSize} onChange={(event) => setDetailSize(event.target.value)}>
            {detail.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select></label>
          <button className="add" onClick={() => { add(detail, detailSize); setDetail(null); }}>ADD TO DEMO BAG <Plus size={16}/></button>
          <p className="disclaimer">Demo products are not stocked or eligible for Stripe checkout.</p>
        </div>
      </section>
    </div>}
    {checkoutOpen && <div className="overlay surplix-checkout-overlay" onClick={() => setCheckoutOpen(false)}>
      <section className="surplix-checkout" role="dialog" aria-modal="true" aria-label="Checkout preview" onClick={(event) => event.stopPropagation()}>
        <div className="surplix-checkout-heading">
          <div><span className="eyebrow orange">SURPLIX OUTLET</span><h2>Checkout preview</h2><p>Stripe sandbox is available for one Supabase product at a time.</p></div>
          <button type="button" className="surplix-close" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}><X/></button>
        </div>
        <div className="surplix-checkout-columns">
          <div className="surplix-checkout-form">
            <div className="surplix-checkout-notice" role="status"><LockKeyhole size={18}/> Stripe TEST MODE — simulated payments only. No real money is charged.</div>
            <h3>Contact information</h3>
            <div className="surplix-field-grid">
              <label>First name<input name="firstName" autoComplete="given-name" value={checkoutFields.firstName} onChange={updateCheckoutField} placeholder="First name"/></label>
              <label>Last name<input name="lastName" autoComplete="family-name" value={checkoutFields.lastName} onChange={updateCheckoutField} placeholder="Last name"/></label>
              <label className="surplix-full">Email<input name="email" type="email" autoComplete="email" value={checkoutFields.email} onChange={updateCheckoutField} placeholder="you@example.com"/></label>
              <label className="surplix-full">Phone (optional)<input name="phone" type="tel" autoComplete="tel" value={checkoutFields.phone} onChange={updateCheckoutField} placeholder="Phone number"/></label>
            </div>
            <h3>Shipping address</h3>
            <div className="surplix-field-grid">
              <label className="surplix-full">Street address<input name="address" autoComplete="street-address" value={checkoutFields.address} onChange={updateCheckoutField} placeholder="Street address"/></label>
              <label className="surplix-full">Apartment or unit (optional)<input name="apartment" value={checkoutFields.apartment} onChange={updateCheckoutField} placeholder="Apartment, suite, unit"/></label>
              <label>City<input name="city" autoComplete="address-level2" value={checkoutFields.city} onChange={updateCheckoutField} placeholder="City"/></label>
              <label>Province or territory<select name="province" autoComplete="address-level1" value={checkoutFields.province} onChange={updateCheckoutField}><option value="">Select province</option>{['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon'].map((province) => <option key={province} value={province}>{province}</option>)}</select></label>
              <label>Postal code<input name="postalCode" autoComplete="postal-code" value={checkoutFields.postalCode} onChange={updateCheckoutField} placeholder="A1A 1A1"/></label>
              <label>Country<input value="Canada" readOnly aria-label="Country"/></label>
            </div>
            <h3>Payment</h3>
            <div className="surplix-payment-pending"><LockKeyhole size={19}/><div><strong>Secure Stripe sandbox checkout</strong><p>Stripe handles test-card entry on its own hosted page. No card details are collected here.</p></div></div>
            {!checkoutEligible && <p className="surplix-checkout-warning" role="status">Test checkout requires exactly one Supabase product (not a demo), with 1–10 units within available stock. Remove other items from the bag to continue.</p>}
            {paymentError && <p className="surplix-checkout-error" role="alert">{paymentError}</p>}
            <button type="button" className="surplix-pay-test" disabled={!checkoutEligible || paymentBusy} onClick={startStripeCheckout}>{paymentBusy ? 'OPENING STRIPE TEST CHECKOUT…' : 'CONTINUE TO STRIPE — TEST MODE'}</button>
            <p className="surplix-checkout-small">Shipping and taxes are not yet calculated. The contact and address fields above are a visual preview only and are not transmitted to Stripe or Supabase by this button. No real orders are placed.</p>
            <button type="button" className="surplix-back" onClick={() => { setCheckoutOpen(false); setDrawer(true); }}><ArrowLeft size={17}/> Return to shopping bag</button>
          </div>
          <aside className="surplix-order-summary">
            <h3>Order summary ({count})</h3>
            {cart.map((item) => <div className="surplix-summary-item" key={item.key}>
              <img src={item.image} alt="" onError={(event) => { if (event.currentTarget.src !== PLACEHOLDER_IMAGE) event.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
              <div><strong>{item.name}</strong><small>Size: {item.size} · Qty: {item.qty}</small><small>{item.isDemo ? 'Demo product' : 'Product preview'}</small></div>
              <b>{fmt(item.price * item.qty)}</b>
            </div>)}
            <div className="surplix-summary-row"><span>Subtotal</span><strong>{fmt(total)}</strong></div>
            <div className="surplix-summary-row"><span>Shipping</span><span>Calculated when launched</span></div>
            <div className="surplix-summary-row"><span>Taxes</span><span>Calculated when launched</span></div>
            <div className="surplix-summary-total"><strong>Subtotal (CAD)</strong><strong>{fmt(total)}</strong></div>
            <p className="surplix-checkout-small">This is not a final payable total. Shipping and applicable taxes are not included.</p>
          </aside>
        </div>
      </section>
    </div>}
    {drawer && <div className="overlay" onClick={() => setDrawer(false)}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><h2>Demo shopping bag ({count})</h2><button aria-label="Close bag" onClick={() => setDrawer(false)}><X/></button></div>
        <div className="drawer-items">{cart.length === 0 ? <p>Your bag is empty.</p> : cart.map((item) =>
          <div className="cart-line" key={item.key}>
            <img src={item.image} alt="" onError={(event) => { if (event.currentTarget.src !== PLACEHOLDER_IMAGE) event.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
            <div><strong>{item.name}</strong><small>Size {item.size}</small><b>{fmt(item.price * item.qty)}</b>
              <div className="quantity">
                <button aria-label="Remove one" onClick={() => change(item.key, -1)}><Minus size={13}/></button>
                <span>{item.qty}</span>
                <button aria-label="Add one" onClick={() => change(item.key, 1)}><Plus size={13}/></button>
              </div>
              <button className="remove-item" onClick={() => remove(item.key)}>Remove item</button>
            </div>
          </div>
        )}</div>
        <div className="drawer-bottom">
          <div><span>Subtotal</span><strong>{fmt(total)}</strong></div>
          <button className="checkout" disabled={cart.length === 0} onClick={() => { setDrawer(false); setCheckoutOpen(true); }}>PROCEED TO CHECKOUT <ArrowRight size={17}/></button>
          <p>Stripe sandbox testing is available for one database product; demo products cannot be purchased.</p>
        </div>
      </aside>
    </div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
