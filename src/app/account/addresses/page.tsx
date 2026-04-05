'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AddressesPage() {
  const [showAddForm, setShowAddForm] = useState(false)

  // Mock data - in real app, this would come from API
  const addresses = [
    {
      id: '1',
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      company: '',
      address1: '123 Main St',
      address2: '',
      city: 'New York',
      state: 'NY',
      postcode: '10001',
      country: 'US',
      isDefault: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <span>/</span>
            <span className="text-gray-900">Addresses</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Shipping Addresses</h1>
          <p className="text-gray-600 mt-2">Manage your shipping and billing addresses</p>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first address to make checkout faster.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>

            {addresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold capitalize">{address.type} Address</h3>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {address.firstName} {address.lastName}
                        {address.company && <><br />{address.company}</>}
                        <br />
                        {address.address1}
                        {address.address2 && <><br />{address.address2}</>}
                        <br />
                        {address.city}, {address.state} {address.postcode}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Address Form */}
        {showAddForm && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add New Address</CardTitle>
              <CardDescription>Enter a new shipping address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" />
              </div>
              <div>
                <Label htmlFor="address1">Address *</Label>
                <Input id="address1" />
              </div>
              <div>
                <Label htmlFor="address2">Apartment, suite, etc. (Optional)</Label>
                <Input id="address2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" />
                </div>
                <div>
                  <Label htmlFor="postcode">Postal Code *</Label>
                  <Input id="postcode" />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" defaultValue="US" />
              </div>
              <div className="flex space-x-2">
                <Button>Save Address</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
