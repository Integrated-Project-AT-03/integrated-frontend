<script setup>

</script>
 
<template>
    <div class="container mx-auto">
        <div class="w-full flex justify-center m-7">
            <div class="text-4xl">IT-Bangmod Kradan Kanban</div>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-200">
                <tr>
                <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
                    ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
                    Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
                    Assignees
                </th>
                <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-base-100 uppercase tracking-wider">
                    Status
                </th>
                </tr>
            </thead>
            <tbody class="itbkk-item bg-slate-100 divide-y divide-gray-200">
                <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">1</div>
                </td>
                <td class="itbkk-title px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Design</div>
                </td>
                <td class="itbkk-assignees px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Goko</div>
                </td>
                <td class="itbkk-status px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">No status</div>
                </td>
                </tr>
            </tbody>
        </table>
  </div>
</template>
 
<style scoped>

</style>