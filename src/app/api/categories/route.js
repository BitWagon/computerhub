import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserToken } from "@/lib/auth";
import Category from "@/models/Category";

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(name, excludeId = null) {
  const baseSlug = createSlug(name);

  if (!baseSlug) {
    throw new Error("A valid category name is required.");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = {
        $ne: new mongoose.Types.ObjectId(excludeId),
      };
    }

    const existingCategory = await Category.findOne(query)
      .select("_id")
      .lean();

    if (!existingCategory) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function getUser() {
  return getCurrentUserToken();
}

function isAdmin(user) {
  return Boolean(user && user.role === "admin");
}

function serializeCategory(category) {
  return {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image: category.image || "",
    isActive: category.isActive !== false,
    featured: Boolean(category.featured),
    sortOrder: Number(category.sortOrder || 0),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Public:
|   Returns active categories only.
|
| Admin:
|   ?includeInactive=true returns all categories.
|--------------------------------------------------------------------------
*/
export async function GET(request) {
  try {
    await connectDB();

    const user = getUser();
    const { searchParams } = new URL(request.url);

    const includeInactive =
      searchParams.get("includeInactive") === "true";

    const featuredOnly =
      searchParams.get("featured") === "true";

    const slug = searchParams.get("slug");

    const query = {};

    /*
     * Public users should only see active categories.
     */
    if (!isAdmin(user) || !includeInactive) {
      query.isActive = true;
    }

    /*
     * Optional featured filter.
     */
    if (featuredOnly) {
      query.featured = true;
    }

    /*
     * Optional slug lookup.
     */
    if (slug) {
      query.slug = slug.toLowerCase().trim();
    }

    const categories = await Category.find(query)
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        categories: categories.map(serializeCategory),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load categories.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Admin only.
|--------------------------------------------------------------------------
*/
export async function POST(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can create categories.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(
      body.description || ""
    ).trim();

    const image = String(body.image || "").trim();

    const isActive =
      body.isActive === undefined
        ? true
        : Boolean(body.isActive);

    const featured =
      body.featured === undefined
        ? false
        : Boolean(body.featured);

    const sortOrder =
      body.sortOrder === undefined ||
      body.sortOrder === ""
        ? 0
        : Number(body.sortOrder);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category name cannot be longer than 100 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (Number.isNaN(sortOrder)) {
      return NextResponse.json(
        {
          success: false,
          message: "Sort order must be a valid number.",
        },
        {
          status: 400,
        }
      );
    }

    const existingName = await Category.findOne({
      name: {
        $regex: `^${name.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    })
      .select("_id")
      .lean();

    if (existingName) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const slug = await createUniqueSlug(name);

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive,
      featured,
      sortOrder,
    });

    console.log(
      `✅ Category created: ${category.name} (${category.slug})`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category: serializeCategory(category),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A category with this name or slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH
|--------------------------------------------------------------------------
| Admin only.
|
| Supports:
| - Editing name
| - Editing description
| - Editing image
| - Changing active status
| - Changing featured status
| - Changing sort order
|--------------------------------------------------------------------------
*/
export async function PATCH(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can update categories.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const id = String(
      body.id || body._id || ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        {
          status: 400,
        }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updateData = {};

    /*
     * Name
     */
    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message: "Category name cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      if (name.length > 100) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Category name cannot be longer than 100 characters.",
          },
          {
            status: 400,
          }
        );
      }

      const existingName = await Category.findOne({
        _id: {
          $ne: category._id,
        },
        name: {
          $regex: `^${name.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}$`,
          $options: "i",
        },
      })
        .select("_id")
        .lean();

      if (existingName) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another category with this name already exists.",
          },
          {
            status: 409,
          }
        );
      }

      updateData.name = name;

      /*
       * Create a new slug only when the name changes.
       */
      if (name !== category.name) {
        updateData.slug = await createUniqueSlug(
          name,
          category._id.toString()
        );
      }
    }

    /*
     * Description
     */
    if (body.description !== undefined) {
      updateData.description = String(
        body.description || ""
      ).trim();
    }

    /*
     * Image
     */
    if (body.image !== undefined) {
      updateData.image = String(
        body.image || ""
      ).trim();
    }

    /*
     * Active status
     */
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(
        body.isActive
      );
    }

    /*
     * Featured status
     */
    if (body.featured !== undefined) {
      updateData.featured = Boolean(
        body.featured
      );
    }

    /*
     * Sort order
     */
    if (body.sortOrder !== undefined) {
      const sortOrder = Number(
        body.sortOrder
      );

      if (Number.isNaN(sortOrder)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Sort order must be a valid number.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.sortOrder = sortOrder;
    }

    Object.assign(category, updateData);

    await category.save();

    console.log(
      `✅ Category updated: ${category.name} (${category._id})`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully.",
        category: serializeCategory(category),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PATCH /api/categories error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A category with this name or slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Admin only.
|
| This permanently deletes the category.
|
| Product-category connection will be handled in a later
| Phase 13 step before using this heavily in production.
|--------------------------------------------------------------------------
*/
export async function DELETE(request) {
  try {
    await connectDB();

    const user = getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can delete categories.",
        },
        {
          status: 403,
        }
      );
    }

    const { searchParams } = new URL(
      request.url
    );

    const id = String(
      searchParams.get("id") || ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    await Category.findByIdAndDelete(id);

    console.log(
      `🗑️ Category deleted: ${category.name} (${id})`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully.",
        categoryId: id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category.",
      },
      {
        status: 500,
      }
    );
  }
}