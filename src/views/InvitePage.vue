<script>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  export default {
    name: "InvitePage",
    setup() {
      const route = useRoute();
      const router = useRouter();
      const boardNanoId = route.params.boardNanoId; // รับค่า boardNanoId จาก route
      const inviterName = ref("John Doe"); // สมมติค่า หรือเปลี่ยนเพื่อดึงจาก API
      const boardName = ref("Project Board"); // สมมติค่า หรือเปลี่ยนเพื่อดึงจาก API
      const accessRight = ref("READ"); // สมมติค่า หรือเปลี่ยนเพื่อดึงจาก API
  
      // ฟังก์ชันสำหรับ accept
      const acceptInvite = async () => {
        try {
          const response = await fetch(`http://localhost:4173/v3/collabs/receive-invite`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boardNanoId,
              receiveInvite: "ACCEPT",
            }),
          });
          if (response.ok) {
            router.push(`/board/${boardNanoId}/task`);
          } else {
            console.error("Failed to accept invite");
          }
        } catch (error) {
          console.error("Error accepting invite:", error);
        }
      };
  
      // ฟังก์ชันสำหรับ decline
      const declineInvite = async () => {
        try {
          const response = await fetch(`http://localhost:4173/v3/collabs/receive-invite`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boardNanoId,
              receiveInvite: "DECLINE",
            }),
          });
          if (response.ok) {
            router.push(`/board`);
          } else {
            console.error("Failed to decline invite");
          }
        } catch (error) {
          console.error("Error declining invite:", error);
        }
      };
  
    
      onMounted(async () => {
        try {
          const response = await fetch(`http://localhost:4173/v3/collabs/invitations/${boardNanoId}`);
          if (response.ok) {
            const data = await response.json();
            inviterName.value = data.inviterName || inviterName.value;
            boardName.value = data.boardName || boardName.value;
            accessRight.value = data.accessRight || accessRight.value;
          } else {
            console.error("Failed to load invitation details");
          }
        } catch (error) {
          console.error("Error loading invitation details:", error);
        }
      });
  
      return {
        inviterName,
        boardName,
        accessRight,
        acceptInvite,
        declineInvite,
      };
    },
  };
  </script>
<template>
    <div class="invite-page">
      <h1>Invitation to Collaborate</h1>
      <p>
        You have been invited to collaborate on the board "{{ boardName }}" by
        "{{ inviterName }}".
      </p>
      <p>Access Level: {{ accessRight }}</p>
  
      <div class="buttons">
        <button @click="acceptInvite" class="accept-btn">Accept</button>
        <button @click="declineInvite" class="decline-btn">Decline</button>
      </div>
    </div>
  </template>
  
  
  
  