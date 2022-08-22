from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', blank=True, related_name="followers", symmetrical=False)
    liked_posts = models.ManyToManyField('Post', related_name="liked_post", blank = True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            
        }

class Post(models.Model):
    post_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_author")
    location = models.CharField(max_length=64)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    time_posted = models.DateTimeField(auto_now_add=True)
    images = models.URLField(blank=True)

    def __str__(self):
        return f"{self.id}: {self.location} by {self.post_author}" 

    def serialize(self):
        return {
            "id": self.id,
            "post_author": self.post_author.serialize(),
            "location": self.location,
            "content": self.content,
            "likes": self.likes,
            "comments": self.comments,
            "time_posted": self.time_posted
        }

class Comment(models.Model):
    comment_author=models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_author")
    content=models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")
    time_posted = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.comment_author} commented on {self.post}"

    def serialize(self):
        return {
            "comment_author": self.comment_author,
            "content": self.content,
            "time-posted": self.time_posted
        }
    