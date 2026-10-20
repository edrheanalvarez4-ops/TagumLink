<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Users
    public function users(): JsonResponse
    {
        return response()->json(User::latest()->paginate(20));
    }

    public function updateUserStatus(Request $request, User $user): JsonResponse
    {
        abort_if($user->role === 'admin', 403, 'Admin accounts cannot be changed here.');

        $data = $request->validate(['status' => ['required', 'in:active,suspended']]);
        $user->update($data);

        return response()->json($user);
    }

    // Listings
    public function opportunities(): JsonResponse
    {
        return response()->json(
            Opportunity::with('organization:id,organization_name')->latest()->paginate(20)
        );
    }

    public function updateOpportunityStatus(Request $request, Opportunity $opportunity): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'in:open,closed,draft']]);
        $opportunity->update($data);

        return response()->json($opportunity);
    }

    public function deleteOpportunity(Opportunity $opportunity): JsonResponse
    {
        $opportunity->delete();

        return response()->json(['message' => 'Listing deleted.']);
    }

    // Categories
    public function storeCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        return response()->json(Category::create($data), 201);
    }

    public function updateCategory(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name,' . $category->id],
            'description' => ['nullable', 'string'],
        ]);
        $category->update($data);

        return response()->json($category);
    }

    public function deleteCategory(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}