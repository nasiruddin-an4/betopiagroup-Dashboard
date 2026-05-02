/**
 * Standardized API utility for managing page-level content
 */

export const loadPageData = async (pageName) => {
  try {
    const response = await fetch(`/api/admin/content?page=${pageName}`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} for ${pageName}`);
      return {};
    }

    const data = await response.json().catch(() => ({}));

    // Transform array of {contentKey, value} to a flat object {key: value}
    const flatData = {};
    if (data && data.content && Array.isArray(data.content)) {
      data.content.forEach((item) => {
        if (item.contentKey) {
          flatData[item.contentKey] = item.value;
        }
      });
    }
    return flatData;
  } catch (error) {
    console.error(`Failed to load page data for ${pageName}:`, error);
    return {};
  }
};

export const savePageData = async (pageName, data) => {
  try {
    const promises = Object.entries(data).map(([key, value]) => {
      const valueStr =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      return fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          page: pageName,
          component: pageName,
          contentKey: key,
          value: valueStr,
          type: typeof value === "object" ? "json" : "text",
        }),
      });
    });

    const results = await Promise.all(promises);
    const firstError = results.find((r) => !r.ok);

    if (firstError) {
      const errJson = await firstError.json().catch(() => ({}));
      throw new Error(errJson.error || "Failed to save some items");
    }

    return { success: true };
  } catch (error) {
    console.error(`Failed to save page data for ${pageName}:`, error);
    throw error;
  }
};

export const deletePageData = async (pageName) => {
  try {
    const response = await fetch(`/api/admin/content/page/${pageName}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Reset failed");
    }
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete page data for ${pageName}:`, error);
    throw error;
  }
};
