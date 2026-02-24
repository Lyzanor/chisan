export type ProducerListItem = {
  id: number;
  slug: string;
  name: string;
  city: string | null;
  category: string | null;
  subcategory: string | null;
  address: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type ProducersApiResponse = {
  items: ProducerListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type TaxonomyBucket = {
  value: string;
  count: number;
};

export type TaxonomyResponse = {
  cities: TaxonomyBucket[];
  categories: TaxonomyBucket[];
  subcategories: TaxonomyBucket[];
};
