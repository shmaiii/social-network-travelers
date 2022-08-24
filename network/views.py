import json
from wsgiref.util import request_uri
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django import forms
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

from .models import *

posts_per_page = 10

def index(request):
    posts = Post.objects.all().order_by("-time_posted")

    paginator = Paginator(posts, posts_per_page)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def new_post(request):
    if request.method == "POST":
        #get data
        data = json.loads(request.body)
        author = request.user
        location = data.get("location", "")
        content = data.get("content", "")
        image = data.get("image", "")
        
        # create post
        post = Post(post_author=author, location=location, content=content, images = image)
        post.save()

        return JsonResponse({"message": "New post has been successfully posted"}, status=201)
    return JsonResponse({"error": "new post failed"}, status = 400)

def profile(request, username, id):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(post_author=user)
    followers_count = User.objects.filter(following=user).count()
    following_count = user.following.all().count()
    
    if request.user in user.followers.all():
        followed = True
    else:
        followed = False
    
    return render (request, "network/profile.html", {
        "profile_user": user,
        "posts": posts,
        "posts_count": posts.count(),
        "followers": followers_count,
        "following": following_count,
        "followed": followed
    })

@csrf_exempt
def posts(request, endpoint):
    posts = Post.objects.all().order_by("-time_posted")
    paginator = Paginator(posts, posts_per_page) 
    current_page = int(request.GET.get('page') or 1)

    if endpoint == "posts":
        page = paginator.page(current_page)
        posts = page.object_list
        return JsonResponse([post.serialize() for post in posts], safe=False)
    elif endpoint == "page":
        return JsonResponse({"page_num": paginator.num_pages})
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def following_api(request, endpoint):

    following = request.user.following.all()
    posts = Post.objects.filter(post_author__in=following).order_by("-time_posted")
    paginator = Paginator(posts, posts_per_page)
    current_page = int(request.GET.get('page') or 1) 

    if endpoint == "posts":
        page = paginator.page(current_page)
        posts = page.object_list
        return JsonResponse([post.serialize() for post in posts], safe=False)
    elif endpoint == "page":
        return JsonResponse({"page_num": paginator.num_pages})
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def profile_posts(request, username, id, endpoint):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(post_author=user).order_by("-time_posted")
    paginator = Paginator(posts, posts_per_page)
    current_page = int(request.GET.get('page') or 1)

    if endpoint == "posts":
        page = paginator.page(current_page)
        posts = page.object_list
        return JsonResponse([post.serialize() for post in posts], safe=False)
    elif endpoint == "page":
        return JsonResponse({"page_num": paginator.num_pages})
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def profile_api(request, username, id):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(post_author=user).order_by("-time_posted")
    followers_count = User.objects.filter(following=user).count()
    following_count = user.following.all().count()
    paginator = Paginator(posts, posts_per_page)
    current_page = int(request.GET.get('page') or 1)
    page = paginator.page(current_page)
    posts = page.object_list

    if request.user in user.followers.all():
        followed = True
    else:
        followed = False
    
    if request.method == "GET":
        return JsonResponse({
            "posts": [post.serialize() for post in posts],
            "profile_user": user.serialize(),
            "posts_count": posts.count(),
            "followers": followers_count,
            "following": following_count,
            "followed": followed,
            "page_num": paginator.num_pages,
            "current_user": request.user.serialize()
    }, safe=False)

    else: 
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@csrf_exempt
def follow(request, user_id):
    user = User.objects.get(pk=user_id)

    if request.method == "GET":
        return JsonResponse(user.serialize())

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("follow") is not None:
            if data["follow"] == "follow":
                request.user.following.add(user)
            elif data["follow"] == "unfollow":
                if user in request.user.following.all():
                    request.user.following.remove(user)
            user.save()
            request.user.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "Something went wrong"
        }, status = 400)

@login_required
def following(request):
    following = request.user.following.all()
    posts = Post.objects.filter(post_author__in=following)

    return render(request, "network/following.html", {
        "posts":  posts.order_by("-time_posted"),
    })

@csrf_exempt
#edit_post can also be used to get data of liked/unliked from a post
def edit_post(request, post_id):
    post = Post.objects.get(pk=post_id)

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("content") is not None:
            content = data.get("content")
            post.content = content
            post.save()
            return HttpResponse(status=204)

        if data.get("like") is not None:
            like = data.get("like")
            if like == "like":
                post.likes = post.likes + 1
                post.save()
                request.user.liked_posts.add(post)
            else :
                post.likes = post.likes - 1
                post.save()
                request.user.liked_posts.remove(post)
            request.user.save()
            return HttpResponse(status = 204)

    elif request.method == "GET":
        if post in request.user.liked_posts.all():
            liked = "true"
        else:
            liked = "false"
        return JsonResponse({"liked": liked})

    else:
        return JsonResponse({
            "error": "Something went wrong"
        }, status = 400)