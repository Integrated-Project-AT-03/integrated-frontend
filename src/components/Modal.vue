<script setup>

</script>
 
<template>
    <div class="w-full h-screen absolute flex justify-center items-center top-0 backdrop-filter backdrop-blur-xl">
        <div class="w-[65rem] h-[47rem] bg-neutral rounded-2xl">
            <div class="itbkk-title text-xl mt-5 ml-6 font-bold">
                Design Backend API for PBI 1,2
            </div>
            <div class="divider"></div>
            <div class="flex justify-around m-4">
                <div class="flex-col">
                    <div>Description</div>
                    <textarea class="itbkk-description w-[35rem] h-[32rem] rounded-2xl border p-3 text-neutral" ></textarea>
                </div>
                <div class="flex flex-col gap-10">
                    <div class="flex-col">
                        <div>Assignees</div>
                        <textarea class="itbkk-assignees w-[20rem] h-[12rem] rounded-2xl border p-3 text-neutral"></textarea>
                    </div>
                    <div class="flex-col">
                        <div>Status</div>
                        <div class="itbkk-status dropdown dropdown-bottom">
                            <div tabindex="0" role="button" class="btn m-1">Choose status</div>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a>No status</a></li>
                                <li><a>Doing</a></li>
                                <li><a>Done</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="flex flex-col h-3/4 gap-3">
                        <div class="flex gap-2">
                            TimeZone:
                            <div class="itbkk-timezone">Test</div>
                        </div>
                        <div class="flex gap-2">
                            Created On:
                            <div class="itbkk-created-on">Test</div>
                        </div>
                        <div class="flex gap-2">
                            Updated On:
                            <div class="itbkk-updated-on">Test</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="flex justify-end m-4 gap-3">
                <button class="btn btn-success w-16">Ok</button>
                <button class="btn">Close</button>
            </div>
        </div>
    </div>
</template>
 
<style scoped>

</style>