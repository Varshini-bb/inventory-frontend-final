"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProduct, updateProduct, uploadProductImages, deleteProductImage } from "@/lib/api";
import Link from "next/link";
import styles from "./EditProduct.module.css";

const UNITS = ["pieces", "kg", "grams", "liters", "ml", "boxes", "packs"];
const CATEGORIES = ["Electronics", "Clothing", "Food", "Beverages", "Furniture", "Tools", "Other"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [unit, setUnit] = useState("pieces");
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await fetchProduct(id);
      setProduct(data);
      
      // Populate form
      setName(data.name || "");
      setSku(data.sku || "");
      setDescription(data.description || "");
      setCategory(data.category || "");
      setTags(data.tags?.join(", ") || "");
      setLowStockThreshold(data.lowStockThreshold || 10);
      setUnit(data.unit || "pieces");
      setCostPrice(data.costPrice || 0);
      setSellingPrice(data.sellingPrice || 0);
      setHasVariants(data.hasVariants || false);
      setVariants(data.variants || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Failed to load product");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !sku) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      await updateProduct(id, {
        name,
        sku,
        description,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        lowStockThreshold,
        unit,
        costPrice,
        sellingPrice,
        hasVariants,
        variants: hasVariants ? variants : []
      });

      alert("Product updated successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);
    try {
      const updated = await uploadProductImages(id, e.target.files);
      setProduct(updated);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
    setUploadingImages(false);
    
    // Reset file input
    e.target.value = "";
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const updated = await deleteProductImage(id, imageUrl);
      setProduct(updated);
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", value: "", sku: "", price: 0, quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loading}>Product not found</div>
          <Link href="/" className={styles.backButton}>Back to Products</Link>
        </div>
      </div>
    );
  }

  const isValid = name.trim() !== "" && sku.trim() !== "";

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Link href="/" className={styles.backLink}>
              <svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </Link>
            <h1 className={styles.title}>Edit Product</h1>
            <p className={styles.subtitle}>Update product information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Product Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  SKU <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Product description..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={styles.input}
                placeholder="Comma separated tags"
              />
            </div>
          </div>

          {/* Product Images */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Images</h2>
            
            <div className={styles.imageGallery}>
              {product?.images?.map((img: string, index: number) => (
                <div key={index} className={styles.imageCard}>
                  <img src={`http://localhost:5000${img}`} alt={`Product ${index + 1}`} className={styles.image} />
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className={styles.deleteImageBtn}
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {img === product.primaryImage && (
                    <span className={styles.primaryBadge}>Primary</span>
                  )}
                </div>
              ))}
              
              <label className={styles.uploadBox}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={uploadingImages}
                />
                <svg className={styles.uploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{uploadingImages ? "Uploading..." : "Add Images"}</span>
              </label>
            </div>
          </div>

          {/* Inventory Settings */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Inventory Settings</h2>
            
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Unit of Measurement</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={styles.input}
                >
                  {UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Low Stock Alert</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pricing</h2>
            
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cost Price</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Selling Price</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {costPrice > 0 && sellingPrice > 0 && (
              <div className={styles.profitInfo}>
                <span>Profit Margin: </span>
                <strong>
                  ${(sellingPrice - costPrice).toFixed(2)} 
                  ({(((sellingPrice - costPrice) / costPrice) * 100).toFixed(1)}%)
                </strong>
              </div>
            )}
          </div>

          {/* Product Variants */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Product Variants</h2>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                />
                <span>Enable Variants</span>
              </label>
            </div>

            {hasVariants && (
              <div className={styles.variantsContainer}>
                {variants.map((variant, index) => (
                  <div key={index} className={styles.variantCard}>
                    <div className={styles.variantHeader}>
                      <h4>Variant {index + 1}</h4>
                      <button
                        onClick={() => removeVariant(index)}
                        className={styles.removeVariantBtn}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className={styles.gridTwo}>
                      <input
                        type="text"
                        placeholder="Name (e.g., Size)"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        className={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Large)"
                        value={variant.value}
                        onChange={(e) => updateVariant(index, "value", e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.gridThree}>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        className={styles.input}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                        className={styles.input}
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={variant.quantity}
                        onChange={(e) => updateVariant(index, "quantity", Number(e.target.value))}
                        className={styles.input}
                        min="0"
                      />
                    </div>
                  </div>
                ))}

                <button onClick={addVariant} className={styles.addVariantBtn}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Variant
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/" className={styles.cancelButton}>
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || !isValid}
              className={`${styles.submitButton} ${
                saving || !isValid ? styles.submitButtonDisabled : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}