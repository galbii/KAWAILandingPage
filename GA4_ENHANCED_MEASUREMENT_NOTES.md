# GA4 Enhanced Measurement Potential Conflicts

## Current Enhanced Measurement Events (Auto-tracked by GA4)
These events may conflict with your custom tracking:

1. **page_view** - Automatic (cannot be disabled)
2. **user_engagement** - Automatic (cannot be disabled) 
3. **scroll** - Enhanced Measurement (can be disabled)
4. **outbound_click** - Enhanced Measurement (can be disabled)
5. **site_search** - Enhanced Measurement (can be disabled)
6. **video_start/video_progress/video_complete** - Enhanced Measurement (can be disabled)
7. **file_download** - Enhanced Measurement (can be disabled)

## Potential Duplicates in Your Custom Tracking

### ✅ No Conflicts (You're using recommended GA4 events):
- `generate_lead` - Standard GA4 event, no conflict
- `sign_up` - Standard GA4 event, no conflict
- `view_item` - Standard GA4 event, no conflict
- `select_content` - Standard GA4 event, no conflict

### ⚠️ Potential Conflicts:
- **Scroll Tracking**: Enhanced Measurement tracks `scroll` at 90% depth. Your disabled `scrollDepth` function won't conflict now.
- **Outbound Links**: Enhanced Measurement tracks `click` on external links. Your button clicks using `select_content` should be distinct enough.

## Recommendations:

### 1. Check GA4 Enhanced Measurement Settings
Navigate to: **Admin → Data Streams → [Your Stream] → Enhanced Measurement**

**Recommended Settings:**
- ✅ **Page views** (automatic, cannot disable)
- ❌ **Scrolls** (disable to avoid conflicts with future scroll tracking)
- ✅ **Outbound clicks** (keep enabled, different from your button clicks)
- ❌ **Site search** (disable if not using)
- ❌ **Video engagement** (disable if not relevant)
- ❌ **File downloads** (disable if not relevant)

### 2. Monitor for Duplicate Events
Watch for these in GA4 Realtime/DebugView:
- Multiple scroll events
- Duplicate click/select_content events
- Unexpected automatic events

### 3. Current Status
✅ **All custom events now use GA4 recommended event names**
✅ **Disabled tracking functions properly set to null**
✅ **Event parameters follow GA4 conventions**
✅ **No reserved event names used**

## Event Naming Validation

All current events meet GA4 requirements:
- ✅ snake_case format
- ✅ ≤ 40 characters
- ✅ No reserved prefixes (firebase_, ga_, google_, gtag., _)
- ✅ Start with letter
- ✅ Only letters, numbers, underscores