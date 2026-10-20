<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    private function openListings()
    {
        return Opportunity::query()
            ->where('status', 'open')
            ->where(function ($q) {
                $q->whereNull('deadline')->orWhere('deadline', '>=', today());
            });
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->openListings()->with(['organization:id,organization_name', 'category:id,name']);

        if ($request->filled('type')) {
            $query->where('opportunity_type', $request->type);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('program')) {
            $query->where('academic_program', 'like', '%' . $request->program . '%');
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('description', 'like', $term)
                  ->orWhere('required_skills', 'like', $term);
            });
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function show(int $id): JsonResponse
    {
        $opportunity = $this->openListings()
            ->with(['organization', 'category'])
            ->findOrFail($id);

        return response()->json($opportunity);
    }
}