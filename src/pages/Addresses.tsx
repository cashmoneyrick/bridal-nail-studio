import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }, { value: 'DC', label: 'Washington D.C.' },
];

interface Address {
  id: string;
  user_id: string;
  name: string;
  street_address: string;
  apartment_unit: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

interface AddressFormData {
  name: string;
  street_address: string;
  apartment_unit: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const emptyFormData: AddressFormData = {
  name: '',
  street_address: '',
  apartment_unit: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'United States',
  is_default: false,
};

const Addresses = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyFormData);
  const [deleteAddress, setDeleteAddress] = useState<Address | null>(null);

  // Auth protection
  useEffect(() => {
    if (initialized && !user) {
      navigate('/auth');
    }
  }, [user, initialized, navigate]);

  // Fetch addresses
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load addresses");
    } else {
      setAddresses(data || []);
    }
    setIsLoading(false);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      street_address: address.street_address,
      apartment_unit: address.apartment_unit || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim() || !formData.street_address.trim() || !formData.city.trim() || 
        !formData.state || !formData.postal_code.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate postal code (US format)
    const postalRegex = /^\d{5}(-\d{4})?$/;
    if (!postalRegex.test(formData.postal_code.trim())) {
      toast.error("Please enter a valid US postal code (e.g., 12345 or 12345-6789)");
      return;
    }

    setIsSaving(true);

    try {
      // If setting as default, unset other defaults first
      if (formData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user!.id);
      }

      if (editingAddress) {
        // Update existing
        const { error } = await supabase
          .from('user_addresses')
          .update({
            name: formData.name.trim(),
            street_address: formData.street_address.trim(),
            apartment_unit: formData.apartment_unit.trim() || null,
            city: formData.city.trim(),
            state: formData.state,
            postal_code: formData.postal_code.trim(),
            country: formData.country,
            is_default: formData.is_default,
          })
          .eq('id', editingAddress.id);

        if (error) throw error;
        toast.success("Address updated");
      } else {
        // Create new
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user!.id,
            name: formData.name.trim(),
            street_address: formData.street_address.trim(),
            apartment_unit: formData.apartment_unit.trim() || null,
            city: formData.city.trim(),
            state: formData.state,
            postal_code: formData.postal_code.trim(),
            country: formData.country,
            is_default: formData.is_default || addresses.length === 0, // First address is default
          });

        if (error) throw error;
        toast.success("Address saved");
      }

      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAddress) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', deleteAddress.id);

      if (error) throw error;
      toast.success("Address deleted");
      setDeleteAddress(null);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      // Unset all defaults first
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user!.id);

      // Set new default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', address.id);

      if (error) throw error;
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to update default address");
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Back link */}
          <Link 
            to="/account" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>

          {/* Header */}
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 shadow-sm mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Saved Addresses</CardTitle>
                    <CardDescription>Manage your shipping addresses</CardDescription>
                  </div>
                </div>
                <Button onClick={openAddDialog} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Addresses List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : addresses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No saved addresses yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Add a shipping address for faster checkout
                </p>
                <Button onClick={openAddDialog} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.is_default && (
                          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-current" />
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-0.5 mb-4">
                      <p>{address.street_address}</p>
                      {address.apartment_unit && <p>{address.apartment_unit}</p>}
                      <p>{address.city}, {address.state} {address.postal_code}</p>
                      <p>{address.country}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditDialog(address)}
                        className="text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDeleteAddress(address)}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                      {!address.is_default && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSetDefault(address)}
                          className="text-xs"
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your address details' : 'Enter your shipping address details'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Address Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Home, Work, Mom's House"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_address">Street Address *</Label>
              <Input
                id="street_address"
                placeholder="123 Main Street"
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartment_unit">Apartment/Unit (optional)</Label>
              <Input
                id="apartment_unit"
                placeholder="Apt 4B, Suite 100, etc."
                value={formData.apartment_unit}
                onChange={(e) => setFormData({ ...formData, apartment_unit: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input
                  id="postal_code"
                  placeholder="12345"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="is_default" 
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({ ...formData, is_default: !!checked })}
              />
              <Label htmlFor="is_default" className="text-sm font-normal cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingAddress ? 'Update' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAddress} onOpenChange={() => setDeleteAddress(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteAddress?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Addresses;