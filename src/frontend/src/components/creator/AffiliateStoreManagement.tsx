import type { AmazonProduct } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddAmazonProduct,
  useDeleteAmazonProduct,
  useGetAllAmazonProducts,
  useUpdateAmazonProduct,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Loader2,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AffiliateStoreManagement() {
  const { data: products = [], isLoading, error } = useGetAllAmazonProducts();
  const addProduct = useAddAmazonProduct();
  const updateProduct = useUpdateAmazonProduct();
  const deleteProduct = useDeleteAmazonProduct();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AmazonProduct | null>(
    null,
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    affiliateLink: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      affiliateLink: "",
    });
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Product name is required");
    }

    if (!formData.description.trim()) {
      errors.push("Description is required");
    }

    if (!formData.imageUrl.trim()) {
      errors.push("Image URL is required");
    }

    if (!formData.category.trim()) {
      errors.push("Category is required");
    }

    if (!formData.affiliateLink.trim()) {
      errors.push("Affiliate link is required");
    } else if (!formData.affiliateLink.startsWith("http")) {
      errors.push("Affiliate link must be a valid URL");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors before adding");
      return;
    }

    try {
      await addProduct.mutateAsync(formData);
      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add product");
    }
  };

  const handleEdit = async () => {
    if (!editingProduct) return;

    if (!validateForm()) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        ...formData,
      });
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const openEditDialog = (product: AmazonProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      affiliateLink: product.affiliateLink,
    });
    setValidationErrors([]);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {products.length === 0 && (
        <Alert className="border-neon-purple/30 bg-neon-purple/5">
          <ShoppingBag className="h-5 w-5 text-neon-purple" />
          <AlertDescription className="ml-2">
            <p className="font-medium text-neon-purple">No products yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Add Product" below to add your first affiliate product
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new Amazon affiliate product to your store
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              onValidate={validateForm}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={addProduct.isPending}>
                {addProduct.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            onValidate={validateForm}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateProduct.isPending}>
              {updateProduct.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground/70">
                        Add your first product to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id.toString()}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteProduct.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    affiliateLink: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      affiliateLink: string;
    }>
  >;
  validationErrors: string[];
  onValidate: () => boolean;
}

function ProductForm({
  formData,
  setFormData,
  validationErrors,
  onValidate,
}: ProductFormProps) {
  return (
    <div className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="ml-2 list-inside list-disc space-y-1">
              {validationErrors.map((error, _index) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={onValidate}
          placeholder="e.g., Resistance Bands Set"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          onBlur={onValidate}
          placeholder="e.g., Fitness Equipment, Apparel, Accessories"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          onBlur={onValidate}
          placeholder="Brief description of the product..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          onBlur={onValidate}
          placeholder="/assets/generated/product-image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="affiliateLink">Amazon Affiliate Link *</Label>
        <Input
          id="affiliateLink"
          value={formData.affiliateLink}
          onChange={(e) =>
            setFormData({ ...formData, affiliateLink: e.target.value })
          }
          onBlur={onValidate}
          placeholder="https://amazon.com/..."
        />
      </div>

      {validationErrors.length === 0 &&
        formData.name &&
        formData.description &&
        formData.imageUrl &&
        formData.category &&
        formData.affiliateLink && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">
              All fields are valid and ready to save
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
