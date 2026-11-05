export const CATEGORIES = Object.freeze([
  { id: 'all', name: 'Semua model' },
  { id: 'bomber-jacket', name: 'Bomber' },
  { id: 'denim-jacket', name: 'Denim' },
  { id: 'hoodie', name: 'Hoodie' },
  { id: 'varsity-jacket', name: 'Varsity' },
  { id: 'parka', name: 'Parka' },
  { id: 'windbreaker-jacket', name: 'Windbreaker' },
  { id: 'leather-jacket', name: 'Jaket Kulit' },
  { id: 'biker-jacket', name: 'Biker' },
  { id: 'coach-jacket', name: 'Coach' },
  { id: 'harrington-jacket', name: 'Harrington' },
  { id: 'puffer-jacket', name: 'Puffer' },
  { id: 'fleece-jacket', name: 'Fleece' },
  { id: 'blazer', name: 'Blazer' },
  { id: 'trench-coat', name: 'Trench Coat' },
  { id: 'track-jacket', name: 'Track Jacket' },
  { id: 'cardigan', name: 'Cardigan' },
  { id: 'raincoat', name: 'Raincoat' },
  { id: 'flannel-jacket', name: 'Flannel' },
  { id: 'safari-jacket', name: 'Safari' },
  { id: 'sherpa-jacket', name: 'Sherpa' },
]);

export const SIZES = Object.freeze(['S', 'M', 'L', 'XL', 'XXL']);

const COLOR_HEX = Object.freeze({
  Black: '#171719',
  Red: '#86131c',
  Charcoal: '#393939',
  Sand: '#c3aa82',
  Cream: '#d8d1bd',
  Olive: '#73805b',
  Navy: '#536982',
  Brown: '#60412f',
  Camel: '#b58a57',
  Indigo: '#394b70',
  Stone: '#a8a397',
  Sage: '#a9b6a1',
  Gray: '#85847d',
  Burgundy: '#702630',
});

const makeProduct = ([id, name, category, tag, description, specification, price, colorId, image]) => ({
  id,
  name,
  category,
  tag,
  image,
  description,
  specification,
  price,
  sizes: SIZES,
  color: {
    id: colorId,
    name: colorId[0].toLocaleUpperCase('en') + colorId.slice(1),
    hex: COLOR_HEX[colorId[0].toLocaleUpperCase('en') + colorId.slice(1)],
  },
});

export const PRODUCTS = Object.freeze([
  ['bomber-jacket', 'Bomber', 'bomber-jacket', 'Classic', 'Bomber hitam berpotongan pendek dengan bukaan ritsleting dan aksen rib.', 'Ritsleting depan · kerah dan manset rib · potongan bomber', 519000, 'black', 'bomber.webp'],
  ['denim-jacket', 'Denim', 'denim-jacket', 'Denim', 'Jaket denim biru dengan kerah klasik, kancing depan, dan dua saku dada.', 'Kancing depan · 2 saku dada · jahitan kontras', 459000, 'indigo', 'denim.jfif'],
  ['hoodie', 'Hoodie', 'hoodie', 'Layering', 'Hoodie hitam dengan tudung dan panel jahitan melengkung pada bagian depan.', 'Tudung · panel jahitan melengkung · manset rib', 429000, 'black', 'hoodie.jpg'],
  ['varsity-jacket', 'Varsity', 'varsity-jacket', 'Campus', 'Jaket bergaya varsity warna sage dengan garis kontras pada kerah dan manset.', 'Kancing depan · kerah dan manset bergaris · detail tulisan dada', 579000, 'sage', 'varsity.jpg'],
  ['parka', 'Parka', 'parka', 'Outdoor', 'Parka panjang abu-abu dengan tudung, penutup depan, dan beberapa saku.', 'Tudung · penutup depan · saku utilitas', 789000, 'gray', 'parka.jpg'],
  ['windbreaker-jacket', 'Windbreaker', 'windbreaker-jacket', 'Lightweight', 'Windbreaker bertudung dengan panel merah dan krem serta bukaan ritsleting depan.', 'Tudung · ritsleting depan · panel color-block', 389000, 'red', 'windbreaker.webp'],
  ['leather-jacket', 'Jaket Kulit', 'leather-jacket', 'Iconic', 'Jaket hitam berkerah lapel dengan bukaan ritsleting diagonal.', 'Ritsleting diagonal · kerah lapel · saku beritsleting', 899000, 'black', 'leather.jpg'],
  ['biker-jacket', 'Biker', 'biker-jacket', 'Moto', 'Jaket biker cokelat dengan kerah lapel lebar dan detail ritsleting.', 'Kerah lapel · detail ritsleting · aksen belt', 929000, 'brown', 'biker.jpg'],
  ['coach-jacket', 'Coach', 'coach-jacket', 'Streetwear', 'Coach jacket warna burgundy dengan kancing depan dan ujung bawah bertali serut.', 'Kancing depan · kerah klasik · hem tali serut', 389000, 'burgundy', 'coach.jfif'],
  ['harrington-jacket', 'Harrington', 'harrington-jacket', 'Heritage', 'Jaket Harrington warna krem dengan kerah kemeja, ritsleting depan, dan saku samping.', 'Kerah kemeja · ritsleting depan · saku samping', 569000, 'sand', 'harrington.jpg'],
  ['puffer-jacket', 'Puffer', 'puffer-jacket', 'Insulated', 'Jaket puffer hitam dengan panel quilting horizontal dan ritsleting depan.', 'Quilting horizontal · ritsleting depan · saku samping', 649000, 'black', 'puffer.jpg'],
  ['fleece-jacket', 'Fleece', 'fleece-jacket', 'Warm Layer', 'Jaket fleece hijau zaitun dengan badan bertekstur dan lengan kontras.', 'Badan fleece · lengan kontras · kerah tinggi', 429000, 'olive', 'fleece.avif'],
  ['blazer', 'Blazer', 'blazer', 'Smart Casual', 'Blazer hitam berkerah lapel dengan potongan rapi dan bagian depan terbuka.', 'Kerah lapel · lengan panjang · potongan formal', 699000, 'black', 'blazer.jpg'],
  ['trench-coat', 'Trench Coat', 'trench-coat', 'Timeless', 'Trench coat warna beige dengan kerah lebar, kancing depan, dan sabuk pinggang.', 'Kancing double-breasted · kerah lebar · sabuk', 899000, 'camel', 'trench coat.jfif'],
  ['track-jacket', 'Track Jacket', 'track-jacket', 'Sport', 'Track jacket hitam dengan panel bahu putih dan garis kontras di lengan.', 'Kerah tegak · ritsleting depan · garis lengan kontras', 399000, 'black', 'track jaket.webp'],
  ['cardigan', 'Cardigan', 'cardigan', 'Knitwear', 'Cardigan rajut warna navy dengan kerah V dan kancing depan.', 'Rajut · kerah V · kancing depan', 329000, 'navy', 'cardigan.jpg'],
  ['raincoat', 'Raincoat', 'raincoat', 'Rain Ready', 'Jaket hujan hitam dengan tudung dan ritsleting depan.', 'Tudung · ritsleting depan · potongan jaket', 529000, 'black', 'raincoat.avif'],
  ['flannel-jacket', 'Flannel', 'flannel-jacket', 'Casual', 'Jaket berwarna abu terang dengan detail motif kotak biru pada bagian dalam tudung.', 'Tudung berlapis motif kotak · ritsleting depan · lengan panjang', 449000, 'stone', 'flannel.avif'],
  ['safari-jacket', 'Safari', 'safari-jacket', 'Utility', 'Jaket safari warna khaki dengan kerah klasik dan empat saku tempel di bagian depan.', '4 saku tempel · kancing depan · kerah klasik', 579000, 'sand', 'safari.jfif'],
  ['sherpa-jacket', 'Sherpa', 'sherpa-jacket', 'Cozy', 'Jaket hitam bergaya denim dengan kerah sherpa warna terang dan dua saku dada.', 'Kerah sherpa · kancing depan · 2 saku dada', 629000, 'black', 'sherpa.jfif'],
].map(makeProduct));

export const findProduct = (id) => PRODUCTS.find((product) => product.id === id);

export const filterProducts = (query, category) => {
  const keyword = query.trim().toLocaleLowerCase('id-ID');
  return PRODUCTS.filter((product) =>
    (category === 'all' || product.category === category) &&
    `${product.name} ${product.description} ${product.specification}`
      .toLocaleLowerCase('id-ID').includes(keyword));
};
