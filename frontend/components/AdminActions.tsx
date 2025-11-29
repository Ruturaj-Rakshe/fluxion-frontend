import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemDemo() {
  return (
    <div className="w-full">
      {/* Top section: headline + verified badge */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>

        <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-md">
          <BadgeCheckIcon className="size-5 text-white" />
          <span className="text-sm font-medium text-white">Verified</span>
        </div>
      </div>

      {/* Grid section for items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Login to another Admin</ItemTitle>
            <ItemDescription>
              Use your credentials to switch between admin accounts.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="default" size="sm">Login</Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Remove Admin</ItemTitle>
            <ItemDescription>
              Permanently delete an admin from the system.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">Remove</Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Add Admin</ItemTitle>
            <ItemDescription>
              Add a new admin to the system.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="secondary" size="sm">Add</Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Add Template</ItemTitle>
            <ItemDescription>
              Add a new template in Fluxion.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="secondary" size="sm">Add</Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Remove Template</ItemTitle>
            <ItemDescription>
              Remove a template from Fluxion.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">Remove</Button>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Update Template</ItemTitle>
            <ItemDescription>
              Update a template in Fluxion.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="secondary" size="sm">Update</Button>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}

